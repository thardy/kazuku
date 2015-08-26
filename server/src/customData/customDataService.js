var _ = require("lodash");
var util = require("util");
var GenericService = require("../common/genericService");
var mongoRql = require('mongo-rql');
var Query = require('rql/query').Query;

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

CustomDataService.prototype.find = function(query, next) {
    var self = this;

//    if (typeof(query) === "string") {
//
//    }

//    if (typeof(query) === "object") {
        var mongoQuery = mongoRql(query);
        var projection = {
            skip: mongoQuery.skip,
            limit: mongoQuery.limit,
            fields: mongoQuery.projection,
            sort: mongoQuery.sort
        };

        return self.collection.find(mongoQuery.criteria, projection)
            .then(function (docs) {
                var transformedDocs = [];
                _.forEach(docs, function (doc) {
                    self.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            });
//    }
};

// todo: replace updateById with an updateByTypeAndId (pretty sure I'm going to have to turn it into a get then an
//  update in order to check and enforce the context - something I'll have to do in order to enforce orgId context anyway)

CustomDataService.prototype.deleteByTypeAndId = function(contentType, id, next) {
    if (arguments.length !== 2) {
        throw new Error('Incorrect number of arguments passed to CustomDataService.deleteByTypeAndId');
    }

    var self = this;

    return self.collection.remove({_id: id, contentType: contentType});
};

module.exports = CustomDataService;

