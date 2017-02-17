"use strict";
let _ = require("lodash");
let Promise = require("bluebird");
let database = require("../database/database").database;
let QueryService = require("../queries/queryService");
let TemplateService = require('../templates/templateService');
let cache = require("memory-cache");
let fs = require("fs-extra");
let path = require("path");
Promise.promisifyAll(fs);

class PublishingService {

    constructor(database) {
        this._db = database;
        this._queryService = new QueryService(database);
        this._templateService = new TemplateService(database, this._queryService);
    }

    get db() { return this._db; }
    get queryService() { return this._queryService; }
    get templateService() { return this._templateService; }

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
                            queryObject.results = queryResults; // persist the results on the queryObject
                            queryObject.regenerate = 0;         // reset the regenerate flag

                            // cache all the query results for this regeneration cycle
                            cache.put(queryObject.name, queryResults);

                            // save the queries back to the database
                            // todo: switch to batch update for all queries (queriesToRegenerate) once I get a batch update working
                            return this.queryService.updateById(orgId, queryObject.id, queryObject);
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
                        return Promise.map(templatesToRegenerate, (templateObject) => {
                            return this.templateService.renderObject(orgId, templateObject)
                                .then((renderedTemplate) => {
                                    if ("url" in templateObject) {
                                        // templateObject is a page, so store the rendered output in a renderedPage property
                                        templateObject.renderedPage = renderedTemplate;
                                        templateObject.regenerate = 0;         // reset the regenerate flag

                                        // todo: output the page to the file system
                                        return this.publishPage(orgId, templateObject)
                                            .then((renderedPage) => {
                                                // save the templates back to the database
                                                // todo: switch to batch update for all templates (templatesToRegenerate) once I get a batch update working
                                                return this.templateService.updateById(orgId, templateObject.id, templateObject);
                                            });
                                    }
                                    return;
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

        let masterBasePath = '/sites';
        let orgBasePath = 'test-org';
        let fileFolder =  path.join(masterBasePath, orgBasePath, templateObject.siteId.toString());
        let filePath = path.join(fileFolder, `${templateObject.url}.html`);

        // Overwrites file if it exists, creates it otherwise.  Creates directories if they don't exist.
        return fs.outputFileAsync(filePath, templateObject.renderedPage, { flag: 'w' });
    }

}

module.exports = PublishingService;