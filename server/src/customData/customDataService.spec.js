var CustomDataService = require("./customDataService");
var database = require("../database/database");
var _ = require("lodash");
var chai = require("chai");
var should = chai.Should();
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var queue = require("queue");
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

    before(function (done) {
        customDataService = new CustomDataService(database);

        deleteAllTestData(function() {
            // Insert a doc to be present before all tests start
            // All test data should belong to a specific orgId (a test org)
            var newCustomData1 = { orgId: testOrgId, contentType: testContentType, title: 'My First Blog Post', content: 'Imagine a well written blog here.'};
            var newCustomData2 = { orgId: testOrgId, contentType: testContentType, title: 'A Dog Ate My Homework', content: 'It was a dark and rainy night...'};

            // switched from async to q - https://github.com/jessetane/queue
            q.push(
                function(callback) {
                    database.customData.insert(newCustomData1, function(err, doc) {
                        if (err) return callback(err);

                        existingCustomData1 = doc;
                        existingCustomData1IdString = doc._id.toHexString();
                        existingCustomData1Title = doc.title;
                        callback();
                    });
                },
                function(callback) {
                    database.customData.insert(newCustomData2, function(err, doc) {
                        if (err) return callback(err);

                        existingCustomData2IdString = doc._id.toHexString();
                        existingCustomData2Title = doc.title;
                        existingCustomData2Content = doc.content;
                        callback();
                    });
                }
            );
            q.start(function (err) {
                if (err) return done(err);

                done();
            });
        });
    });

    after(function (done) {
        // Remove all Test documents
        deleteAllTestData(function() {
            done();
        });
    });

    it("can create customData of a specified ContentType", function (done) {
        var testBlogContent = 'Test blog post here.';
        var customData = { orgId: testOrgId, contentType: testContentType, title: 'New Test Blog Post', content: testBlogContent };;
        customDataService.create(customData, function(err, createdCustomData) {
            if (err) return done(err);

            should.exist(createdCustomData);
            should.exist(createdCustomData.id);
            createdCustomData.content.should.equal(testBlogContent);
            done();
        });
    });

    it("can get all data of a specified ContentType", function (done) {
        customDataService.getByContentType(testContentType, function (err, docs) {
            if (err) return done(err);

            docs.should.be.instanceOf(Array);
            docs.length.should.be.greaterThan(1);
            done();
        });
    });

    it("can get customData by Id", function (done) {
        customDataService.getById(existingCustomData1IdString, function(err, customData) {
            if (err) return done(err);

            should.exist(customData);
            customData.title.should.equal(existingCustomData1Title);
            done();
        });
    });

    it("can update customData by id", function (done) {
        var newContent = '#New Test Content';
        theUpdatedCustomData = { orgId: testOrgId, contentType: testContentType, title: 'My First Blog Post', content: newContent };
        customDataService.updateById(existingCustomData1IdString, theUpdatedCustomData, function (err, numAffected) {
            if (err) return done(err);

            numAffected.should.equal(1);

            // verify customData was updated
            customDataService.getById(existingCustomData1IdString, function(err, retrievedCustomData) {
                if (err) return done(err);

                should.exist(retrievedCustomData);
                retrievedCustomData.content.should.be.equal(newContent);
                done();
            });
        });
    });

    it("can delete customData by id", function (done) {
        var newCustomData = { orgId: testOrgId, contentType: testContentType, title: 'Some title here', content: 'this customData is to be deleted'};
        customDataService.create(newCustomData, function(err, customData) {
            if (err) return done(err);

            customDataService.delete(customData.id, function(err) {
                if (err) return done(err);

                customDataService.getById(customData.id, function(err, retrievedCustomData) {
                    if (err) return done(err);

                    should.not.exist(retrievedCustomData);
                    done();
                });
            });
        });
    });

    function deleteAllTestData(next) {
        database.customData.remove({contentType: testContentType, orgId: 1}, function (err) {
            if(err) return next(err);

            next();
        });
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