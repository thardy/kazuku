'use strict';
import _ from 'lodash';
import Promise from 'bluebird';
import QueryService from '../queries/queryService.js';
import OrganizationService from '../organizations/organizationService.js';
import SiteService from '../sites/siteService.js';
import TemplateService from '../templates/templateService.js';
import cache from 'memory-cache';
import fs from 'fs-extra';
import path from 'path';
Promise.promisifyAll(fs);

class PublishingService {

    constructor(database) {
        this.db = database;
        this.queryService = new QueryService(database);
        this.templateService = new TemplateService(database, this.queryService);
        this.orgService = new OrganizationService(database);
        this.siteService = new SiteService(database);
    }

    regenerateItems(orgId, siteId) {
        let queriesToRegenerate = [];
        let templatesToRegenerate = [];

        // get the list of queries that need to be regenerated
        return this.queryService.getRegenerateList(orgId)
            .then((queriesToRegenerate) => {
                // Regenerate/resolve all of the queries
                return Promise.map(queriesToRegenerate, (queryObject) => {
                    return this.queryService.resolve(orgId, queryObject.query)
                        .then((queryResults) => {
                            let updatedQueryProperties = {
                                results: queryResults,  // persist the results on the queryObject
                                regenerate: 0   // reset the regenerate flag
                            };

                            // cache all the query results for this regeneration cycle
                            cache.put(`query_${queryObject.nameId}`, queryResults);

                            // save the queries back to the database
                            // todo: switch to batch update for all queries (queriesToRegenerate) once I get a batch update working
                            return this.queryService.updateByIdWithoutCallingBeforeAndAfterUpdate(orgId, queryObject.id, updatedQueryProperties);
                        });
                })
               // // todo: save the queryObjects back to the database as a batch instead of looping through them one at a time
               // .then((resolvedQueries) => {
               //     // reset the regenerate flag on all the queries we resolved
               //     for (var queryObject of resolvedQueries) {
               //          queryObject.results = queryResults; // persist the results on the queryObject
               //          queryObject.regenerate = 0;
               //          // cache all the query results for this regeneration cycle
               //          cache.put(queryObject.name, queryResults);
               //     }
               //     return this.queryService.updateBatch(orgId, queriesToRegenerate);
               // })
                .catch(e => {
                    throw e;
                });
            })
            // get the list of templates that need to be regenerated.  Right now it should just be pages, but there
            //  might be a need for non-page templates to be generated in the future, so let's keep it generic.
            .then((result) => {
                // todo: clean up this promise implementation (flatten, etc)
                return this.templateService.getRegenerateList(orgId)
                    .then((templatesToRegenerate) => {
                        // Regenerate/render all of the templates
                        // Promise.map gives us a little more control over concurrency than Promise.all, but we probably want to move
                        //  to Promise.all once we get batch update working.
                        return Promise.map(templatesToRegenerate, (templateObject) => {
                            return this.templateService.renderObject(orgId, templateObject)
                                .then((renderedTemplate) => {
                                    if ("url" in templateObject) {
                                        // templateObject is a page, so store the rendered output in a renderedPage property
                                        templateObject.renderedPage = renderedTemplate;

                                        let updatedProperties = {
                                            renderedPage: renderedTemplate,
                                            regenerate: 0
                                        };

                                        // output the page to the file system
                                        let publishPagePromise = this.publishPage(orgId, templateObject);
                                        let templateUpdatePromise = publishPagePromise.then(() => {
                                            return this.templateService.updateByIdWithoutCallingBeforeAndAfterUpdate(orgId, templateObject.id, updatedProperties);
                                        });
                                        return Promise.all([publishPagePromise, templateUpdatePromise])
                                            .then(([publishResult, templateUpdateResult]) => {
                                                return {
                                                    pageName: templateObject.nameId,
                                                    templateUpdateResult: templateUpdateResult
                                                };
                                            });

                                        // return this.publishPage(orgId, templateObject)
                                        //     .then((renderedPage) => {
                                        //         // save the templates back to the database
                                        //         // todo: switch to batch update for all templates (templatesToRegenerate) once I get a batch update working
                                        //         return this.templateService.updateByIdWithoutCallingBeforeAndAfterUpdate(orgId, templateObject.id, updatedProperties);
                                        //     });
                                    }
                                    else {
                                        return Promise.resolve(null);
                                    }
                                })

                        })
//                    // todo: save the templateObjects back to the database as a batch instead of looping through them one at a time
//                    .then((templatesToRegenerate) => {
//                        // reset the regenerate flag on all the queries we resolved
//                        for (var templateObject of templatesToRegenerate) {
//                            templateObject.regenerate = 0;
//                        }
//                        return this.templateService.updateBatch(orgId, templatesToRegenerate);
//                    })
                        .catch(e => {
                            throw e;
                        });
                    });
            })
            .then((results) => {
                // Clear the cache
                let keys = cache.keys();
                for (let key of keys) {
                    cache.del(key);
                }
                return results;
            })
            .catch(e => {
                throw e;
            });

    }

    publishPage(orgId, templateObject) {
        // verify that templateObject is a page (has a url)
        if (!templateObject.url) {
            console.log(`templateObject with name ${templateObject.name} does not have url property in publishingService.publishPage()`);
        }

        // get site from cache
        let site = cache.get(`site_${templateObject.siteId}`);
        let promise = site ? Promise.resolve(site) : this.siteService.getById(orgId, templateObject.siteId);

        return promise
            .then((results) => {
                site = results;
                cache.put(`site_${templateObject.siteId}`, site);
                return Promise.resolve(site);
            })
            .then((site) => {
                let masterBasePath = path.join(global.appRoot, 'siteContent');
                let fileFolder =  path.join(masterBasePath, site.code);
                let filePath = path.join(fileFolder, `${templateObject.url}.html`);

                // Overwrites file if it exists, creates it otherwise.  Creates directories if they don't exist.
                return fs.outputFileAsync(filePath, templateObject.renderedPage, { flag: 'w' });
            })
            .catch(e => {
                throw e;
            });

    }

}

export default PublishingService;