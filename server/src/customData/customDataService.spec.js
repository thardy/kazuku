var CustomDataService = require("./customDataService");
var Promise = require("bluebird");
var database = require("../database/database");
var _ = require("lodash");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;
var moment = require("moment");
var Query = require("rql/query").Query;

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

describe("CustomDataService CRUD", function () {
    var customDataService = {};
    var existingCustomData1 = {};
    var existingCustomData2 = {};
//    var existingCustomData1IdString = {};
//    var existingCustomData1TypeString = {};
//    var existingCustomData2IdString = {};
//    var existingCustomData1Title = '';
//    var existingCustomData2Title = '';
//    var existingCustomData2Content = '';
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
                existingCustomData1.id = existingCustomData1._id.toHexString();
                return doc;
            })
            .then(function(result) {
                return database.customData.insert(newCustomData2);
            })
            .then(function(doc) {
                existingCustomData2 = doc;
                existingCustomData2.id = existingCustomData2._id.toHexString();
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

    it("can get customData by contentType and Id", function () {
        var getByTypeAndId = customDataService.getByTypeAndId(existingCustomData1.contentType, existingCustomData1.id);

        return getByTypeAndId.should.eventually.have.property("title", existingCustomData1.title);
    });

    it("can update customData by id", function () {
        var newContent = '#New Test Content';
        theUpdatedCustomData = { content: newContent };

        var updateByIdPromise = customDataService.updateById(existingCustomData1.id, theUpdatedCustomData);

        return updateByIdPromise.then(function(numAffected) {
            numAffected.should.equal(1);

            // verify customData was updated
            var getByIdPromise = customDataService.getById(existingCustomData1.id);

            getByIdPromise.should.eventually.have.property("content", newContent);
        });
    });

    it("can delete customData by id", function () {
        var newCustomData = { orgId: testOrgId, contentType: testContentType, title: 'Some title here', content: 'this customData is to be deleted'};
        var createPromise = customDataService.create(newCustomData);

        return createPromise
            .then(function(doc) {
                var id = doc.id;
                return customDataService.delete(doc.id)
                    .then(function(result) {
                        return customDataService.getById(id)
                            .then(function(retrievedDoc) {
                                return expect(retrievedDoc).to.equal(null);
                            });
                    });
            });
    });

    function deleteAllTestData() {
        return database.customData.remove({orgId: 1, contentType: testContentType});
    }
});

describe("CustomDataService RQL", function () {
    var customDataService = {};
    var existingProducts = [];
    var testOrgId = 1;
    var testContentType = 'testProducts';

    before(function () {
        customDataService = new CustomDataService(database);
        // Insert some docs to be present before all tests start
        var newProduct1 = { orgId: testOrgId, contentType: testContentType, name: 'Widget', description: 'It is a widget.', price: 9.99 };
        var newProduct2 = { orgId: testOrgId, contentType: testContentType, name: 'Log', description: 'Such a wonderful toy! It\'s fun for a girl or a boy.', price: 99.99 };
        var newProduct3 = { orgId: testOrgId, contentType: testContentType, name: 'Doohicky', description: 'Like a widget, only better.', price: 19.99 };

        return deleteAllTestData()
            .then(function(result) {
                return Promise.all([
                    database.customData.insert(newProduct1),
                    database.customData.insert(newProduct2),
                    database.customData.insert(newProduct3)
                ]);
            })
            .then(function(docs) {
                existingProducts = docs;
                return docs;
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

    function deleteAllTestData() {
        return database.customData.remove({orgId: testOrgId, contentType: testContentType});
    }

    it("can query using an RQL query object", function () {
        var name = 'Widget';
        var query = new Query().eq('name', name);
        var findPromise = customDataService.find(query);

        return findPromise.should.eventually.contain.an.item.with.property("name", name);
    });

    it("can query using multiple RQL operators", function () {
        var query = new Query().gt('price', 10.00).eq('contentType', testContentType);
        var findPromise = customDataService.find(query);

        return Promise.all([
            findPromise.should.eventually.be.instanceOf(Array),
            findPromise.should.eventually.have.length.equal(1)
        ]);
    });

    it("can query using an RQL string");
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