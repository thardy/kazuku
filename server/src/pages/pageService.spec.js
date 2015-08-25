var PageService = require("./pageService");
var Promise = require("bluebird");
var database = require("../database/database");
var _ = require("lodash");
var chai = require("chai");
var should = chai.Should();
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var moment = require("moment");

chai.use(chaiAsPromised);

describe("PageService", function () {
    var pageService = {};
    var existingPage1 = {};
    var existingPage1IdString = {};
    var existingPage2IdString = {};
    var existingPage1Name = '';
    var existingPage2Name = '';
    var existingPage2Url = '';
    var theUpdatedPage = {};
    var testOrgId = 1;

    before(function () {
        pageService = new PageService(database);
        // Insert a doc to be present before all tests start
        var newPage1 = {name: '$Test Page 1 - existing', orgId: testOrgId, siteId: 1, url: '#/test', content: '#Test Page 1 - Existing'};
        var newPage2 = {name: '$Test Page 2 - existing', orgId: testOrgId, siteId: 1, url: '#/test2', content: '#Test Page 2 - Existing'};

        return deleteAllTestPages()
            .then(function(result) {
                return database.pages.insert(newPage1);
            })
            .then(function(doc) {
                existingPage1 = doc;
                existingPage1IdString = doc._id.toHexString();
                existingPage1Name = doc.name;
                return doc;
            })
            .then(function(result) {
                return database.pages.insert(newPage2);
            })
            .then(function(doc) {
                existingPage2IdString = doc._id.toHexString();
                existingPage2Name = doc.name;
                existingPage2Url = doc.url;
                return doc;
            })
            .then(null, function(error) {
                console.log(error);
                throw error;
            });
    });

    after(function () {
        // Remove all Test documents
        return deleteAllTestPages();
    });

    // todo: alter to enforce orgId (in genericService preferably) and siteId (in pageService override)
    it("can get all Pages", function () {
        var getAllPromise = pageService.getAll();

        return Promise.all([
            getAllPromise.should.eventually.be.instanceOf(Array),
            getAllPromise.should.eventually.have.length.greaterThan(1)
        ]);
    });

    it("can get a Page by id", function () {
        var getByIdPromise = pageService.getById(existingPage1IdString);

        return getByIdPromise.should.eventually.have.property("name", existingPage1Name);
    });

    it("can create a Page", function () {
        var page = { orgId: testOrgId, siteId: 1, name: '$Test - create page', url: '#/created', content: '#Test' };
        var createPromise = pageService.create(page);

        return Promise.all([
            createPromise.should.eventually.have.property("id"),
            createPromise.should.eventually.have.property("url", '#/created')
        ]);
    });

    it("validates Page on create using base validation - orgId", function () {
        var invalidPage = { name: '$Test - create page', siteId: 1, url: '#/invalid-page', content: '#Test' };
        var createPromise = pageService.create(invalidPage);

        return createPromise.should.be.rejectedWith(TypeError, "Need orgId");
    });

    it("validates Page on create using extended validation - name, url, content", function () {
        var invalidPage = { orgId: testOrgId, siteId: 1, name: '$Test - create page', url: '#/invalid-page' };
        var createPromise = pageService.create(invalidPage);

        return createPromise.should.be.rejectedWith(TypeError, "Need name, url, and content");
    });

    it("can update a Page by id", function () {
        var newContent = '#New Test Content';
        _.assign(theUpdatedPage, { id: existingPage1IdString, siteId: 1, name: existingPage1Name, content: newContent });
        var updateByIdPromise = pageService.updateById(existingPage1IdString, theUpdatedPage);

        return updateByIdPromise.then(function(numAffected) {
            numAffected.should.equal(1);

            // verify page was updated
            var getByIdPromise = pageService.getById(existingPage1IdString);

            return getByIdPromise.should.eventually.have.property("content", newContent);
        });
    });

    it("can update a Page by query object", function () {
        var newUrl = '#/updated-url2';
        var newContent = '#New Test Content for query by object';
        var updatedPage = { id: existingPage2IdString, orgId: testOrgId, siteId: 1, name: existingPage2Name, url: newUrl, content: newContent };
        var queryObject = { name: existingPage2Name, url: existingPage2Url};

        var updateByObjectPromise = pageService.update(queryObject, updatedPage);

        return updateByObjectPromise.then(function(numAffected) {
            numAffected.should.equal(1);

            // verify page was updated
            var getByIdPromise = pageService.getById(existingPage2IdString);

            return Promise.all([
                getByIdPromise.should.eventually.have.property("url", newUrl),
                getByIdPromise.should.eventually.have.property("content", newContent)
            ]);
        });
    });

    it("can delete a Page by id", function () {
        var newPage = { orgId: testOrgId, siteId: 1, name: '$Test - deleting this one', url: '#/delete', content: '#Delete' };

        return pageService.create(newPage).then(function(doc) {
            var id = doc.id;
            return pageService.delete(doc.id).then(function(result) {
                return pageService.getById(id).then(function (retrievedDoc) {
                    return expect(retrievedDoc).to.equal(null);
                });
            });
        });
    });

    it("has a unique index on siteId and url", function () {
        var newPage = { orgId: testOrgId, siteId: existingPage1.siteId, url: existingPage1.url, name: '$Test - I am a dupe',content: '#DUPE' };
        var createPromise = pageService.create(newPage);

        return createPromise.should.eventually.be.rejected;
    });

    function deleteAllTestPages() {
        return database.pages.remove({name: /^\$Test.*/, orgId: testOrgId});
    }
});

