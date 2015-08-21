var _ = require("lodash");
var util = require("util");
var GenericService = require("../common/genericService");

var PageService = function PageService(db) {
    PageService.super_.call(this, db, "pages");
};
util.inherits(PageService, GenericService);

PageService.prototype.validate = function(doc) {
    if (doc.name && doc.url && doc.content) {
        // call base validation, which should return nothing if valid
        return GenericService.prototype.validate(doc);
    }
    else {
        return "Need name, url, and content";
    }
};

module.exports = PageService;
