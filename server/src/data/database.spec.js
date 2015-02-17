var should = require("should");
var database = require("./database");

describe("database", function () {

    after(function (done) {
        // Remove all documents we added
        database.pages.remove({name: /^Test.*/, siteId: 1}, function (err) {
            if(err) {
                database.close();
                return done(err);
            }
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
        database.pages.insert({name: 'Test Page', siteId: 1, stateName: 'root.test', url: '#/test', content: '#Test Page'},
            function (err, doc) {
                if(err) return done(err);
                should.exists(doc);
                done();
            }
        );
    });
    it("can query using regex", function (done) {
        database.pages.find({name: /^Test.*/, siteId: 1}, function(err, docs) {
            if (err) return done(err);
            docs.should.be.instanceof(Array);
            docs.length.should.be.greaterThan(0);
            done();
        });
    });
});