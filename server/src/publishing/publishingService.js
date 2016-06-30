"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var database = require("../database/database");
var QueryService = require("../queries/queryService");
var TemplateService = require('../templates/templateService');

class PublishingService {

    constructor(database) {
        this._db = database;
        this._queryService = new QueryService(database);
        this._templateService = new TemplateService(database);
    }

    get db() { return this._db; }
    get queryService() { return this._queryService; }
    get templateService() { return this._templateService; }

    regenerateItems(orgId, siteId) {
        let queriesToRegenerate = [];
        let templatesToRegenerate = [];

        return Promise.all([
            // get the list of queries that need to be regenerated
            this.queryService.getRegenerateList(orgId)
                .then((queriesToRegenerate) => {
                    // Regenerate/resolve all of the queries
                    return Promise.map(queriesToRegenerate, (queryObject) => {
                        return this.queryService.resolve(orgId, queryObject.query)
                            .then((queryResults) => {
                                queryObject.results = queryResults; // persist the results on the queryObject
                                queryObject.regenerate = 0;         // reset the regenerate flag

                                // save the queries back to the database
                                // todo: switch to batch update for all queries (queriesToRegenerate) once I get a batch update working
                                return this.queryService.updateById(orgId, queryObject.id, queryObject);
                            });
                    })
//                    // todo: save the queryObjects back to the database as a batch instead of looping through them one at a time
//                    .then((result) => {
//                        // reset the regenerate flag on all the queries we resolved
//                        for (var queryObject of queriesToRegenerate) {
//                            queryObject.regenerate = 0;
//                        }
//                        return this.queryService.updateBatch(orgId, queriesToRegenerate);
//                    })
                    .catch(e => {
                        throw e;
                    });
                }),
            // get the list of templates that need to be regenerated
            this.templateService.getRegenerateList(orgId)
                .then((templatesToRegenerate) => {
                    // Regenerate/render all of the templates
                    return Promise.map(templatesToRegenerate, (templateObject) => {
                        return this.templateService.renderObject(templateObject)
                            .then((renderedTemplate) => {
                                templateObject.renderedTemplate = renderedTemplate; // persist the renderedTemplate on the templateObject
                                templateObject.regenerate = 0;         // reset the regenerate flag

                                // save the templates back to the database
                                // todo: switch to batch update for all templates (templatesToRegenerate) once I get a batch update working
                                return this.templateService.updateById(orgId, templateObject.id, templateObject);
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
                })
        ]);
    }
}

module.exports = PublishingService;