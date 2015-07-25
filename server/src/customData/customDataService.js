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

CustomDataService.prototype.getByContentType = function(contentType, next) {
    var self = this;

    self.collection.find({contentType: contentType}, function(err, docs) {
        if (err) return next(err);

        var transformedDocs = [];
        _.forEach(docs, function(doc) {
            GenericService.prototype.useFriendlyId(doc);
            transformedDocs.push(doc);
        });

        next(null, transformedDocs);
    });
};


//var CustomDataService = function(db) {
//    var self = this;
//    var collection = db.customData;
//
//    // Public functions
//    self.getAll = function(next) {
//        db.pages.find({}, function(err, docs) {
//            if (err) return next(err);
//
//            var pages = [];
//            _.forEach(docs, function(doc) {
//                useFriendlyId(doc);
//                pages.push(doc);
//            });
//
//            next(null, pages);
//        });
//    };
//
//    self.getById = function(id, next) {
//        db.pages.findOne({_id: id}, function(err, doc) {
//            if (err) return next(err);
//
//            useFriendlyId(doc);
//            next(null, doc);
//        });
//    };
//
//    self.create = function(page, next) {
//
//        var valError = validate(page);
//        if (valError) return next(valError);
//
//        db.pages.insert(page, function (err, doc) {
//            if (err) return next(err);
//
//            useFriendlyId(doc);
//            next(null, doc);
//        });
//    };
//
//    self.updateById = function(id, updatedPage, next) {
//        var clone = _.clone(updatedPage);
//        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
//        // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
//        db.pages.updateById(id, {$set: clone}, function (err, numAffected) {
//            if (err) return next(err);
//
//            next(null, numAffected);
//        });
//    };
//
//    self.update = function(queryObject, updatedPage, next) {
//        var clone = _.clone(updatedPage);
//        delete clone.id;
//        db.pages.update(queryObject, {$set: clone}, function (err, numAffected) {
//            if (err) return next(err);
//
//            next(null, numAffected);
//        });
//    };
//
//    self.delete = function(id, next) {
//        db.pages.remove({_id: id}, function (err) {
//            if (err) return next(err);
//
//            next(null);
//        });
//    };
//
//    // Private functions
//    var validate = function(doc) {
//        if (doc.name && doc.siteId && doc.url && doc.content) {
//            // simply do nothing if valid
//            return;
//        }
//        else {
//            return "Need siteId, name, url, and content";
//        }
//    };
//
//    var useFriendlyId = function(doc) {
//        if (doc && doc._id) {
//            doc.id = doc._id.toHexString();
//        }
//    };

//};

module.exports = CustomDataService;

