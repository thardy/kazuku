"use strict";
var _ = require("lodash");
var GenericService = require("../common/genericService");

class QueryService extends GenericService {
    constructor(database) {
        super(database, 'queries');
    }

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
