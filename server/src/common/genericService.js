var _ = require("lodash");
var Promise = require("bluebird");

var GenericService = function(db, collectionName) {
    var self = this;

    // Public properties
    self.collection = db[collectionName];

    // Public functions
    self.getAll = function(next) {
        return self.collection.find({})
            .then(function(docs) {
                var transformedDocs = [];
                _.forEach(docs, function(doc) {
                    self.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            });

//        self.collection.find({}, function(err, docs) {
//            if (err) return next(err);
//
//            var transformedDocs = [];
//            _.forEach(docs, function(doc) {
//                self.useFriendlyId(doc);
//                transformedDocs.push(doc);
//            });
//
//            next(null, transformedDocs);
//        });
    };

    self.getById = function(id) {
        return self.collection.findOne({_id: id})
            .then(function(doc) {
                self.useFriendlyId(doc);
                return doc;
            });
    };

    self.create = function(doc) {
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

    self.updateById = function(id, updatedDoc, next) {
        var clone = _.clone(updatedDoc);
        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
        // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
        return self.collection.updateById(id, {$set: clone});

//        self.collection.updateById(id, {$set: clone}, function (err, numAffected) {
//            if (err) return next(err);
//
//            next(null, numAffected);
//        });
    };

    self.update = function(queryObject, updatedDoc, next) {
        var clone = _.clone(updatedDoc);
        delete clone.id;

        return self.collection.update(queryObject, {$set: clone});
//        self.collection.update(queryObject, {$set: clone}, function (err, numAffected) {
//            if (err) return next(err);
//
//            next(null, numAffected);
//        });
    };

    self.delete = function(id, next) {
        return self.collection.remove({_id: id});
//        self.collection.remove({_id: id}, function (err) {
//            if (err) return next(err);
//
//            next(null);
//        });
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