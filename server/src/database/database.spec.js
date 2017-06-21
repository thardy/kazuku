const database = require("./database").database;
const mongoose = require('mongoose')
const Promise = require("bluebird");
const chai = require("chai");
const should = chai.Should();
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;

chai.use(chaiAsPromised);

describe("database", function () {

    // after(function () {
    //     // Remove all documents we added
    //     return database.templates.remove({name: /^\$Test.*/, siteId: 2});
    // });

    it("can connect to mongo", function () {
        mongoose.connection.readyState.should.be.ok;
    });

    // todo: consider moving into a simple mongoose model test
    // it("can retrieve collections", function () {
    //     should.exist(database.templates);
    // });
    //
    // it("can add to collections", function () {
    //     var testTemplate = '#Test Template';
    //     var insertPromise = database.templates.insert({name: '$TestTemplate', siteId: 2, template: testTemplate});
    //
    //     return insertPromise.should.eventually.have.property("template", testTemplate);
    // });
    //
    // it("can query using regex", function () {
    //     var findPromise = database.templates.find({name: /^\$Test.*/, siteId: 2});
    //
    //     return Promise.all([
    //         findPromise.should.eventually.be.instanceOf(Array),
    //         findPromise.should.eventually.have.length.greaterThan(0)
    //     ]);
    // });
});