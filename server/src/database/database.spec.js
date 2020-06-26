import {database} from './database.js';
import Promise from 'bluebird';
import chai from 'chai';
const should = chai.Should();
import chaiAsPromised from 'chai-as-promised';
const expect = chai.expect;

chai.use(chaiAsPromised);

describe("database", function () {

    after(function () {
        // Remove all documents we added
        return database.templates.remove({name: /^\$Test.*/, siteId: 2});
    });

    it("can connect to mongo", function () {
        should.exist(database.db);
    });

    it("can retrieve collections", function () {
        should.exist(database.templates);
    });

    it("can add to collections", function () {
        var testTemplate = '#Test Template';
        var insertPromise = database.templates.insert({name: '$TestTemplate', siteId: 2, template: testTemplate});

        return insertPromise.should.eventually.have.property("template", testTemplate);
    });

    it("can query using regex", function () {
        var findPromise = database.templates.find({name: /^\$Test.*/, siteId: 2});

        return Promise.all([
            findPromise.should.eventually.be.instanceOf(Array),
            findPromise.should.eventually.have.length.greaterThan(0)
        ]);
    });
});