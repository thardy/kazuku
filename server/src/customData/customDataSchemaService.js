var _ = require("lodash");
var util = require("util");
var GenericService = require("../common/genericService");

var CustomDataSchemaService = function CustomDataSchemaService(db) {
    CustomDataSchemaService.super_.call(this, db, "customDataSchema");
};
util.inherits(CustomDataSchemaService, GenericService);

CustomDataSchemaService.prototype.validate = function(doc) {
    if (doc.contentType && doc.jsonSchema) {
        // call base validation, which should return nothing if valid
        return GenericService.prototype.validate(doc);
    }
    else {
        return "Need contentType and jsonSchema";
    }
};

CustomDataSchemaService.prototype.getAll = undefined;
CustomDataSchemaService.prototype.getByContentType = function(contentType, next) {
    var self = this;

    return self.collection.findOne({contentType: contentType})
        .then(function (doc) {
            self.useFriendlyId(doc);
            return doc;
        });
};

CustomDataSchemaService.prototype.getById = undefined;
CustomDataSchemaService.prototype.getByTypeAndId = function(contentType, id, next) {
    if (arguments.length !== 2) {
        throw new Error('Incorrect number of arguments passed to CustomDataSchemaService.getByTypeAndId');
    }

    var self = this;

    return self.collection.findOne({_id: id, contentType: contentType})
        .then(function (doc) {
            self.useFriendlyId(doc);
            return doc;
        });
};

// todo: replace updateById with an updateByTypeAndId (pretty sure I'm going to have to turn it into a get then an
//  update in order to check and enforce the context - something I'll have to do in order to enforce orgId context anyway)

CustomDataSchemaService.prototype.delete = undefined;
CustomDataSchemaService.prototype.deleteByTypeAndId = function(contentType, id, next) {
    if (arguments.length !== 2) {
        throw new Error('Incorrect number of arguments passed to CustomDataSchemaService.deleteByTypeAndId');
    }

    var self = this;

    return self.collection.remove({_id: id, contentType: contentType});
};

module.exports = CustomDataSchemaService;


