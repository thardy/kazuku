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

CustomDataService.prototype.getByContentType = function(orgId, contentType) {
    if (arguments.length !== 2) {
        throw new Error('Incorrect number of arguments passed to CustomDataService.getByContentType');
    }
    var self = this;

    return self.collection.find({orgId: orgId, contentType: contentType})
        .then(function (docs) {
            var transformedDocs = [];
            _.forEach(docs, function(doc) {
                self.useFriendlyId(doc);
                transformedDocs.push(doc);
            });

            return transformedDocs;
        });
};

CustomDataService.prototype.getByTypeAndId = function(orgId, contentType, id) {
    if (arguments.length !== 3) {
        throw new Error('Incorrect number of arguments passed to CustomDataService.getByTypeAndId');
    }

    var self = this;

    return self.collection.findOne({_id: id, orgId: orgId, contentType: contentType})
        .then(function (doc) {
            self.useFriendlyId(doc);
            return doc;
        });
};

CustomDataService.prototype.find = function(orgId, query) {
    if (arguments.length !== 2) {
        throw new Error('Incorrect number of arguments passed to CustomDataService.find');
    }
    var self = this;
    query.orgId = orgId;

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
};

// todo: replace updateById with an updateByTypeAndId (pretty sure I'm going to have to turn it into a get then an
//  update in order to check and enforce the context - something I'll have to do in order to enforce orgId context anyway)

CustomDataService.prototype.deleteByTypeAndId = function(orgId, contentType, id) {
    if (arguments.length !== 3) {
        throw new Error('Incorrect number of arguments passed to CustomDataService.deleteByTypeAndId');
    }

    var self = this;

    return self.collection.remove({_id: id, orgId: orgId, contentType: contentType});
};

module.exports = CustomDataService;

