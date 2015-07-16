var _ = require("lodash");

var GenericService = function(db, collectionName) {
    var self = this;

    // Public properties
    self.collection = db[collectionName];

    // Public functions
    self.getAll = function(next) {
        self.collection.find({}, function(err, docs) {
            if (err) return next(err);

            var pages = [];
            _.forEach(docs, function(doc) {
                useFriendlyId(doc);
                pages.push(doc);
            });

            next(null, pages);
        });
    };

    self.getById = function(id, next) {
        self.collection.findOne({_id: id}, function(err, doc) {
            if (err) return next(err);

            useFriendlyId(doc);
            next(null, doc);
        });
    };

    self.create = function(page, next) {

        var valError = this.validate(page);
        if (valError) return next(valError);

        self.collection.insert(page, function (err, doc) {
            if (err) return next(err);

            useFriendlyId(doc);
            next(null, doc);
        });
    };

    self.updateById = function(id, updatedPage, next) {
        var clone = _.clone(updatedPage);
        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
        // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
        self.collection.updateById(id, {$set: clone}, function (err, numAffected) {
            if (err) return next(err);

            next(null, numAffected);
        });
    };

    self.update = function(queryObject, updatedPage, next) {
        var clone = _.clone(updatedPage);
        delete clone.id;
        self.collection.update(queryObject, {$set: clone}, function (err, numAffected) {
            if (err) return next(err);

            next(null, numAffected);
        });
    };

    self.delete = function(id, next) {
        self.collection.remove({_id: id}, function (err) {
            if (err) return next(err);

            next(null);
        });
    };

    // Virtual functions
    GenericService.prototype.validate = function(doc) {
        if (doc.siteId) {
            // simply do nothing if valid
            return;
        }
        else {
            return "Need siteId";
        }
    };


    // Private functions
    var useFriendlyId = function(doc) {
        if (doc && doc._id) {
            doc.id = doc._id.toHexString();
        }
    };
};

module.exports = GenericService;