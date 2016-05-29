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

        // get the list of queries that need to be regenerated
        this.queryService.getRegenerateList(orgId)
            .then((docs) => {
                queriesToRegenerate = docs;

                // Regenerate/resolve the queries
                for (var query of docs) {
                    // todo: add resolve function to queryService
                    this.queryService.resolve(query);
                }
            });

        // get the list of templates that need to be regenerated
        this.templateService.getRegenerateList(orgId)
            .then((docs) => {
                templatesToRegenerate = docs;

                // Regenerate/render the templates
                for (var template of docs) {
                    // todo: need to add renderTemplate function to templateService. Can renderObject work? Can we just alter it to look for content OR template?
                    this.templateService.renderObject(template);
                }
            });

    }
}

module.exports = PublishingService;