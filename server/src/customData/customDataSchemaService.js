var _ = require("lodash");
var util = require("util");
var GenericService = require("../common/genericService");

var CustomDataSchemaService = function CustomDataSchemaService(db) {
    CustomDataSchemaService.super_.call(this, db, "customDataSchema");
};
util.inherits(CustomDataSchemaService, GenericService);

CustomDataSchemaService.prototype.validate = function(doc) {
    if (doc.contentType) {
        // call base validation, which should return nothing if valid
        return GenericService.prototype.validate(doc);
    }
    else {
        return "Need contentType";
    }
};

CustomDataSchemaService.prototype.getByContentType = function(contentType, next) {
    var self = this;

    return self.collection.findOne({contentType: contentType})
        .then(function (doc) {
            self.useFriendlyId(doc);
            return doc;
        });
};

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

CustomDataSchemaService.prototype.deleteByTypeAndId = function(contentType, id, next) {
    if (arguments.length !== 2) {
        throw new Error('Incorrect number of arguments passed to CustomDataSchemaService.deleteByTypeAndId');
    }

    var self = this;

    return self.collection.remove({_id: id, contentType: contentType});
};

module.exports = CustomDataSchemaService;


