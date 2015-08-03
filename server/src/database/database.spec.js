var database = require("./database");
var Promise = require("bluebird");
var chai = require("chai");
var should = chai.Should();
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;

chai.use(chaiAsPromised);

describe("database", function () {

    after(function () {
        // Remove all documents we added
        return database.pages.remove({name: /^\$Test.*/, siteId: 2});
    });

    it("can connect to mongo", function () {
        should.exist(database.db);
    });

    it("can retrieve collections", function () {
        should.exist(database.pages);
    });

    it("can add to collections", function () {
        var testContent = '#Test Page';
        var insertPromise = database.pages.insert({name: '$Test Page', siteId: 2, url: '#/test', content: testContent});

        return insertPromise.should.eventually.have.property("content", testContent);
    });

    it("can query using regex", function () {
        var findPromise = database.pages.find({name: /^\$Test.*/, siteId: 2});

        return Promise.all([
            findPromise.should.eventually.be.instanceOf(Array),
            findPromise.should.eventually.have.length.greaterThan(0)
        ]);
    });
});