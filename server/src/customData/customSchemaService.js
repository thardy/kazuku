var _ = require("lodash");
var util = require("util");
var GenericService = require("../common/genericService");

var CustomSchemaService = function CustomSchemaService(db) {
    CustomSchemaService.super_.call(this, db, "customSchemas");
};
util.inherits(CustomSchemaService, GenericService);

CustomSchemaService.prototype.validate = function(doc) {
    if (doc.contentType && doc.jsonSchema) {
        // call base validation, which should return nothing if valid
        return GenericService.prototype.validate(doc);
    }
    else {
        return "Need contentType and jsonSchema";
    }
};

// todo: consider adding a generic query function to genericService - just allow passing in a query object, which
//  is what mongo takes anyway => {contentType: contentType, someOtherProp: someOtherVal}
CustomSchemaService.prototype.getByContentType = function(contentType, next) {
    var self = this;

    return self.collection.findOne({contentType: contentType})
        .then(function (doc) {
            self.useFriendlyId(doc);
            return doc;
        });
};

module.exports = CustomSchemaService;


