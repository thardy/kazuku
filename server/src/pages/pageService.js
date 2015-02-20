var database = require("../database/database");
var Page = require("./page");
var _ = require("lodash");


var PageService = function(db) {
    var self = this;

    // Public functions
    self.getAll = function(next) {
        db.pages.find({}, function(err, docs) {
            if (err) next(err);

            var pages = null;
            if (docs) {
                pages = [];
                _.forEach(docs, function(doc) {
                    var page = new Page(doc);
                    pages.push(page);
                });
            }

            next(null, pages);
        });
    };

    self.getById = function(id, next) {
        db.pages.findOne({_id: id}, function(err, doc) {
            if (err) next(err);

            var page = doc ? new Page(doc) : null;
            next(null, page);
        });
    };

    self.create = function(page, next) {
        db.pages.insert(page, function (err, doc) {
            if (err) next(err);

            var page = doc ? new Page(doc) : null;
            next(null, page);
        });
    };

    self.updateById = function(id, updatedPage, next) {
        var clone = _.clone(updatedPage);
        delete clone.id;
        db.pages.updateById(id, clone, function (err, numAffected) {
            if (err) next(err);

            next(null, numAffected);
        });
    };

    self.update = function(queryObject, updatedPage, next) {
        var clone = _.clone(updatedPage);
        delete clone.id;
        db.pages.update(queryObject, clone, function (err, numAffected) {
            if (err) next(err);

            next(null, numAffected);
        });
    };

    self.delete = function(id, next) {
        db.pages.remove({_id: id}, function (err) {
            if (err) next(err);

            next(null);
        });
    };

    // Private functions
    var someFunction = function(){

    };

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

};

module.exports = PageService;
