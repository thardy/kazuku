"use strict";
var _ = require("lodash");
var GenericService = require("../common/genericService");

class TemplateService extends GenericService {
    constructor(database) {
        super(database, 'templates');
    }

    getAllDependentsOfItem(item) {
        return [];
    }

    validate(doc) {
        if (doc.name && doc.template) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return "Need name and template";
        }
    }

}

module.exports = TemplateService;
