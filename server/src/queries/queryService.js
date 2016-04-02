"use strict";
var _ = require("lodash");
var GenericService = require("../common/genericService");

class QueryService extends GenericService {
    constructor(database) {
        super(database, 'queries');
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
