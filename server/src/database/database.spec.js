var chai = require("chai");
var should = chai.Should();
var database = require("./database");

describe("database", function () {

    after(function (done) {
        // Remove all documents we added
        database.pages.remove({name: /^\$Test.*/, siteId: 2}, function (err) {
            if(err) return done(err);

            done();
        });
    });

    it("can connect to mongo", function (done) {
        should.exist(database.db);
        done();
    });
    it("can retrieve collections", function (done) {
        should.exist(database.pages);
        done();
    });
    it("can add to collections", function (done) {
        database.pages.insert({name: '$Test Page', siteId: 2, url: '#/test', content: '#Test Page'},
            function (err, doc) {
                if(err) return done(err);
                should.exist(doc);
                done();
            }
        );
    });
    it("can query using regex", function (done) {
        database.pages.find({name: /^\$Test.*/, siteId: 2}, function(err, docs) {
            if (err) return done(err);
            docs.should.be.instanceof(Array);
            docs.length.should.be.greaterThan(0);
            done();
        });
    });
});