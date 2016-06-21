"use strict";
var _ = require("lodash");
var GenericService = require("../common/genericService");
var CustomDataService = require("../customData/customDataService");

class QueryService extends GenericService {
    constructor(database) {
        super(database, 'queries');
        this._customDataService = new CustomDataService(database);
    }

    get customDataService() { return this._customDataService; }

    getRegenerateList(orgId) {
        return this.collection.find({orgId: orgId, regenerate: 1})
            .then((docs) => {
                var transformedDocs = [];
                _.forEach(docs, (doc) => {
                    this.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            });
    }

    getAllDependentsOfItem(item) {
        return [];
    }

    resolve(orgId, query) {
        return this.customDataService.find(orgId, query);
    }

    validate(doc) {
        if (doc.name && doc.query) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return "Need name and query";
        }
    }

}

module.exports = QueryService;
