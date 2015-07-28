var CustomDataService = require("./customDataService");
var Promise = require("bluebird");
var database = require("../database/database");
var _ = require("lodash");
var chai = require("chai");
var should = chai.Should();
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var queue = require("queue");
var moment = require("moment");

var q = queue();

chai.use(chaiAsPromised);

describe("CustomDataService CRUD", function () {
    var customDataService = {};
    var existingCustomData1 = {};
    var existingCustomData1IdString = {};
    var existingCustomData2IdString = {};
    var existingCustomData1Title = '';
    var existingCustomData2Title = '';
    var existingCustomData2Content = '';
    var theUpdatedCustomData = {};
    var testOrgId = 1;
    var testContentType = 'testType';

    before(function () {
        customDataService = new CustomDataService(database);
        // Insert some docs to be present before all tests start
        // All test data should belong to a specific orgId (a test org)
        var newCustomData1 = { orgId: testOrgId, contentType: testContentType, title: 'My First Blog Post', content: 'Imagine a well written blog here.'};
        var newCustomData2 = { orgId: testOrgId, contentType: testContentType, title: 'A Dog Ate My Homework', content: 'It was a dark and rainy night...'};

        return deleteAllTestData()
            .then(function(result) {
                return database.customData.insert(newCustomData1);
            })
            .then(function(doc) {
                existingCustomData1 = doc;
                existingCustomData1IdString = doc._id.toHexString();
                existingCustomData1Title = doc.title;
                return doc;
            })
            .then(function(result) {
                return database.customData.insert(newCustomData2);
            })
            .then(function(doc) {
                existingCustomData2IdString = doc._id.toHexString();
                existingCustomData2Title = doc.title;
                existingCustomData2Content = doc.content;
                return doc;
            })
            .then(null, function(error) {
                console.log(error);
                throw error;
            });
    });

    after(function () {
        // Remove all Test documents
        return deleteAllTestData();
    });

    it("can create customData of a specified ContentType", function () {
        var now = moment().format('MMMM Do YYYY, h:mm:ss a');
        var testBlogContent = 'Test blog post here. ' + now;
        var customData = { orgId: testOrgId, contentType: testContentType, title: 'New Test Blog Post', content: testBlogContent };

        var createPromise = customDataService.create(customData);

        return Promise.all([
            createPromise.should.eventually.be.an("object"),
            createPromise.should.eventually.have.property("content", testBlogContent)
        ]);
    });

    it("validates customData on create using base validation - orgId", function () {
        var invalidCustomData = { contentType: testContentType, title: 'New Test Blog Post', content: 'content of invalid customData object' };

        var createPromise = customDataService.create(invalidCustomData);

        return createPromise.should.be.rejectedWith(TypeError, "Need orgId");
    });

    it("validates customData on create using extended validation - contentType", function () {
        var invalidCustomData = { orgId: testOrgId, title: 'New Test Blog Post2', content: 'content of invalid customData object' };

        var createPromise = customDataService.create(invalidCustomData);

        return createPromise.should.be.rejectedWith(TypeError, "Need contentType");
    });

    it("can get all data of a specified ContentType", function () {
        var getByContentTypePromise = customDataService.getByContentType(testContentType);

        return Promise.all([
            getByContentTypePromise.should.eventually.be.instanceOf(Array),
            getByContentTypePromise.should.eventually.have.length.greaterThan(1)
        ]);
    });

    it("can get customData by Id", function () {
        var getByIdPromise = customDataService.getById(existingCustomData1IdString);

        getByIdPromise.should.eventually.have.property("title", existingCustomData1Title);
    });

    it("can update customData by id", function () {
        var newContent = '#New Test Content';
        theUpdatedCustomData = { orgId: testOrgId, contentType: testContentType, title: 'My First Blog Post', content: newContent };

        var updateByIdPromise = customDataService.updateById(existingCustomData1IdString, theUpdatedCustomData);

        updateByIdPromise.then(function(numAffected) {
            numAffected.should.equal(1);

            // verify customData was updated
            var getByIdPromise = customDataService.getById(existingCustomData1IdString);

            getByIdPromise.should.eventually.have.property("content", newContent);
        });
    });

    it("can delete customData by id", function () {
        var newCustomData = { orgId: testOrgId, contentType: testContentType, title: 'Some title here', content: 'this customData is to be deleted'};
        var createPromise = customDataService.create(newCustomData);

        createPromise.then(function(doc) {
            var id = doc.id;
            customDataService.delete(doc.id).then(function(result) {
                customDataService.getById(id).then(function(retrievedDoc) {
                    retrievedDoc.should.eventually.equal(undefined);
                });
            });
        });
    });

    function deleteAllTestData() {
        return database.customData.remove({orgId: 1, contentType: testContentType});
    }
});

describe("CustomDataService Queries", function () {
    it("can query custom string fields by value");

    it("can query custom number fields by value");
    it("can query custom number fields greater than value");
    it("can query custom number fields in range");

    it("can query custom date fields by value");
    it("can query custom date fields greater than value");
    it("can query custom date fields within range");
});