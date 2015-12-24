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

CustomSchemaService.prototype.getByContentType = function(orgId, contentType) {
    if (arguments.length !== 2) {
        throw new Error('Incorrect number of arguments passed to CustomSchemaService.getByContentType');
    }
    var self = this;

    return self.collection.findOne({orgId: orgId, contentType: contentType})
        .then(function (doc) {
            self.useFriendlyId(doc);
            return doc;
        });
};

CustomSchemaService.prototype.updateByContentType = function(orgId, contentType, updatedDoc) {
    if (arguments.length !== 3) {
        throw new Error('Incorrect number of arguments passed to CustomSchemaService.updateByContentType');
    }
    var self = this;
    var clone = _.clone(updatedDoc);
    delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
    // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
    return self.collection.update({orgId: orgId, contentType: contentType}, {$set: clone});
};

CustomSchemaService.prototype.deleteByContentType = function(orgId, contentType) {
    if (arguments.length !== 2) {
        throw new Error('Incorrect number of arguments passed to CustomSchemaService.deleteByContentType');
    }
    var self = this;
    return self.collection.remove({orgId: orgId, contentType: contentType});
};

module.exports = CustomSchemaService;


