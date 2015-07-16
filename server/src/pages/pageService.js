var _ = require("lodash");
var util = require("util");
var GenericService = require("../common/genericService");

var PageService = function PageService(db) {
    PageService.super_.call(this, db, "pages");
};
util.inherits(PageService, GenericService);

PageService.prototype.validate = function(doc) {
    if (doc.name && doc.url && doc.content) {
        // call base validation, which should return nothing if valid
        return GenericService.prototype.validate(doc);
    }
    else {
        return "Need name, url, and content";
    }
};


//var PageService = function(db) {
//    var self = this;
//    var collection = db.pages;

//    // Public functions
//    self.getAll = function(next) {
//        collection.find({}, function(err, docs) {
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
//        collection.findOne({_id: id}, function(err, doc) {
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
//        collection.insert(page, function (err, doc) {
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
//        collection.updateById(id, {$set: clone}, function (err, numAffected) {
//            if (err) return next(err);
//
//            next(null, numAffected);
//        });
//    };
//
//    self.update = function(queryObject, updatedPage, next) {
//        var clone = _.clone(updatedPage);
//        delete clone.id;
//        collection.update(queryObject, {$set: clone}, function (err, numAffected) {
//            if (err) return next(err);
//
//            next(null, numAffected);
//        });
//    };
//
//    self.delete = function(id, next) {
//        collection.remove({_id: id}, function (err) {
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

    //find the user
//    var findUser = function(authResult){
//        db.users.first({email : authResult.creds.email}, function(err,found){
//            assert.ok(err === null, err);
//            if(found){
//                authResult.user = new User(found);
//                self.emit("user-found",authResult);
//            }else{
//                self.emit("invalid",authResult);
//            }
//        })
//    };

//};

module.exports = PageService;
