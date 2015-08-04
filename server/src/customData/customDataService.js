var _ = require("lodash");
var util = require("util");
var GenericService = require("../common/genericService");

var CustomDataService = function CustomDataService(db) {
    CustomDataService.super_.call(this, db, "customData");
};
util.inherits(CustomDataService, GenericService);

CustomDataService.prototype.validate = function(doc) {
    if (doc.contentType) {
        // call base validation, which should return nothing if valid
        return GenericService.prototype.validate(doc);
    }
    else {
        return "Need contentType";
    }
};

// todo: add orgId to every call (once I figure out where I get orgId from and whether I'm going to pass it in here
//  as a parameter or grab it out of the ether straight from here)
CustomDataService.prototype.getByContentType = function(contentType, next) {
    var self = this;

    return self.collection.find({contentType: contentType})
        .then(function (docs) {
            var transformedDocs = [];
            _.forEach(docs, function(doc) {
                self.useFriendlyId(doc);
                transformedDocs.push(doc);
            });

            return transformedDocs;
        });
};

CustomDataService.prototype.getByTypeAndId = function(contentType, id, next) {
    if (arguments.length !== 2) {
        throw new Error('Incorrect number of arguments passed to CustomDataService.getByTypeAndId');
    }

    var self = this;

    return self.collection.findOne({_id: id, contentType: contentType})
        .then(function (doc) {
            self.useFriendlyId(doc);
            return doc;
        });
};

CustomDataService.prototype.deleteByTypeAndId = function(contentType, id, next) {
    if (arguments.length !== 2) {
        throw new Error('Incorrect number of arguments passed to CustomDataService.deleteByTypeAndId');
    }

    var self = this;

    return self.collection.remove({_id: id, contentType: contentType});
};

module.exports = CustomDataService;

