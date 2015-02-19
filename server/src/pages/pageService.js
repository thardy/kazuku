var database = require("../database/database");
var Page = require("./page");

var PageService = function(db) {
    var self = this;

    // Public functions
    self.getAll = function(next) {
        db.pages.find({}, next);
    };

    self.getById = function(id, next) {
        db.findOne({_id: id}, function(err, doc) {
            if (err) {
                // todo: handle error
            }
            if (doc) {
                page = new Page(doc);
            }
            else {

            }
        });
    };

    self.create = function(page, next) {
        db.pages.insert(page, function (err, doc) {
            if (err) next(err);

            var page = doc ? new Page(doc) : null;
            next(null, page);
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
