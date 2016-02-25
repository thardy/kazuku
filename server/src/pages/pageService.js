'use strict';
var _ = require("lodash");
var util = require("util");
var GenericService = require("../common/genericService");

class PageService extends GenericService {
    constructor(database) {
        super(database, "pages");
    }

    validate(doc) {
        if (doc.name && doc.url && doc.content) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return "Need name, url, and content";
        }
    }
}

module.exports = PageService;
