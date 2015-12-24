var _ = require("lodash");
var Promise = require("bluebird");

var GenericService = function(db, collectionName) {
    var self = this;

    // Public properties
    self.collection = db[collectionName];

    // Public functions
    self.getAll = function(orgId) {
        if (arguments.length !== 1) {
            throw new Error('Incorrect number of arguments passed to GenericService.getAll');
        }

        return self.collection.find({orgId: orgId})
            .then(function(docs) {
                var transformedDocs = [];
                _.forEach(docs, function(doc) {
                    self.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            });
    };

    self.getById = function(orgId, id) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to GenericService.getById');
        }
        return self.collection.findOne({_id: id, orgId: orgId})
            .then(function(doc) {
                self.useFriendlyId(doc);
                return doc;
            });
    };

    self.create = function(orgId, doc) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to GenericService.create');
        }
        doc.orgId = orgId;
        var valError = this.validate(doc);
        if (valError) {
            return Promise.reject(new TypeError(valError));
        }

        return self.collection.insert(doc)
            .then(function(doc) {
                self.useFriendlyId(doc);
                return doc;

            });
    };

    self.updateById = function(orgId, id, updatedDoc) {
        if (arguments.length !== 3) {
            throw new Error('Incorrect number of arguments passed to GenericService.updateById');
        }
        var clone = _.clone(updatedDoc);
        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
        // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided

        // todo: test that I don't need to use ObjectId(id)
        var queryObject = { _id: id, orgId: orgId };
        return self.collection.update(queryObject, {$set: clone});
    };

    self.update = function(orgId, queryObject, updatedDoc) {
        if (arguments.length !== 3) {
            throw new Error('Incorrect number of arguments passed to GenericService.update');
        }
        var clone = _.clone(updatedDoc);
        delete clone.id;

        queryObject.orgId = orgId;
        return self.collection.update(queryObject, {$set: clone});
    };

    self.delete = function(orgId, id) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to GenericService.delete');
        }
        return self.collection.remove({ _id: id, orgId: orgId });
    };

    self.useFriendlyId = function(doc) {
        if (doc && doc._id) {
            doc.id = doc._id.toHexString();
        }
    };

    // Virtual functions
    GenericService.prototype.validate = function(doc) {
        if (doc.orgId) {
            // simply do nothing if valid
            return;
        }
        else {
            return "Need orgId";
        }
    };

    // Private functions
//    var useFriendlyId = function(doc) {
//        if (doc && doc._id) {
//            doc.id = doc._id.toHexString();
//        }
//    };
};

module.exports = GenericService;