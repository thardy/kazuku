"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var database = require("../database/database");
var QueryService = require("../queries/queryService");
var TemplateService = require('../templates/templateService');
var cache = require("memory-cache");

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

                                        // save the templates back to the database
                                        // todo: switch to batch update for all templates (templatesToRegenerate) once I get a batch update working
                                        return this.templateService.updateById(orgId, templateObject.id, templateObject);
                                    }
                                    return;
                                });
                        })
//                    // todo: save the templateObjects back to the database as a batch instead of looping through them one at a time
//                    .then((result) => {
//                        // reset the regenerate flag on all the queries we resolved
//                        for (var queryObject of queriesToRegenerate) {
//                            queryObject.regenerate = 0;
//                        }
//                        return this.templateService.updateBatch(orgId, templatesToRegenerate);
//                    })
                        .catch(e => {
                            throw e;
                        });
                        // todo: regenerating a template with a url (a page) should output the page to the file system
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
            // todo: replace with catch as soon as I get rid of Monk
            .then(null, (e) => {
                throw e;
            });

    }
}

module.exports = PublishingService;