var CustomDataSchemaService = require("./customDataSchemaService");
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

describe("CustomDataSchemaService CRUD", function () {
    var customDataSchemaService = {};
    var existingCustomDataSchema1 = {};
    var existingCustomDataSchema2 = {};
    var theUpdatedCustomDataSchema = {};
    var testOrgId = 1;
    var testContentType1 = 'testType1';
    var testContentType2 = 'testType2';

    before(function () {
        customDataSchemaService = new CustomDataSchemaService(database);
        // Insert some docs to be present before all tests start
        // All test data should belong to a specific orgId (a test org)
        var newCustomDataSchema1 = {
            orgId: testOrgId,
            contentType: testContentType1,
            jsonSchema: {
                "type": "object",
                "properties": {
                    "favoriteString": {
                        "type": "string",
                        "name": "favoriteString",
                        "title": "Favorite String"
                    },
                    "favoriteNumber": {
                        "type": "number",
                        "name": "favoriteNumber",
                        "title": "Favorite Number"
                    }
                }
            }
        };
        var newCustomDataSchema2 = {
            orgId: testOrgId,
            contentType: testContentType2,
            jsonSchema: {
                "type": "object",
                "properties": {
                    "someString": {
                        "type": "string",
                        "name": "someString",
                        "title": "Some String"
                    }
                }
            }
        };

        return deleteAllTestSchema()
            .then(function(result) {
                return database.customDataSchema.insert(newCustomDataSchema1);
            })
            .then(function(doc) {
                existingCustomDataSchema1 = doc;
                return doc;
            })
            .then(function(result) {
                return database.customDataSchema.insert(newCustomDataSchema2);
            })
            .then(function(doc) {
                existingCustomDataSchema2 = doc;
                return doc;
            })
            .then(null, function(error) {
                console.log(error);
                throw error;
            });
    });

    after(function () {
        // Remove all Test documents
        return deleteAllTestSchema();
    });

    it("can create customDataSchema of a specified ContentType", function () {
        var now = moment().format('hmmss');
        var testFieldName = 'TestField' + now;
        var myJsonSchema = {
            "type": "object",
            "properties": {
                someField: {
                    "type": "string",
                    "name": testFieldName,
                    "title": "Some Field"
                }
            }
        };
        var customDataSchema = {
            orgId: testOrgId,
            contentType: testContentType2,
            jsonSchema: myJsonSchema
        };

        var createPromise = customDataSchemaService.create(customDataSchema);

        return Promise.all([
            createPromise.should.eventually.be.an("object"),
            createPromise.should.eventually.have.property("jsonSchema", myJsonSchema)
        ]);
    });

    // todo: stopped here last
    it("validates customDataSchema on create using base validation - orgId", function () {
        var invalidCustomDataSchema = { contentType: testContentType1, title: 'New Test Blog Post', content: 'content of invalid customDataSchema object' };

        var createPromise = customDataSchemaService.create(invalidCustomDataSchema);

        return createPromise.should.be.rejectedWith(TypeError, "Need orgId");
    });

    it("validates customDataSchema on create using extended validation - contentType", function () {
        var invalidCustomDataSchema = { orgId: testOrgId, title: 'New Test Blog Post2', content: 'content of invalid customDataSchema object' };

        var createPromise = customDataSchemaService.create(invalidCustomDataSchema);

        return createPromise.should.be.rejectedWith(TypeError, "Need contentType");
    });

    it("can get all data of a specified ContentType", function () {
        var getByContentTypePromise = customDataSchemaService.getByContentType(testContentType1);

        return Promise.all([
            getByContentTypePromise.should.eventually.be.instanceOf(Array),
            getByContentTypePromise.should.eventually.have.length.greaterThan(1)
        ]);
    });

    it("can get customDataSchema by contentType and Id", function () {
        var getByTypeAndId = customDataSchemaService.getByTypeAndId(existingCustomDataSchema1.contentType, existingCustomDataSchema1.id);

        getByTypeAndId.should.eventually.have.property("title", existingCustomDataSchema1.title);
    });

    it("can update customDataSchema by id", function () {
        var newContent = '#New Test Content';
        theUpdatedCustomDataSchema = { orgId: testOrgId, contentType: testContentType1, title: 'My First Blog Post', content: newContent };

        var updateByIdPromise = customDataSchemaService.updateById(existingCustomDataSchema1.id, theUpdatedCustomDataSchema);

        updateByIdPromise.then(function(numAffected) {
            numAffected.should.equal(1);

            // verify customDataSchema was updated
            var getByIdPromise = customDataSchemaService.getById(existingCustomDataSchema1.id);

            getByIdPromise.should.eventually.have.property("content", newContent);
        });
    });

    it("can delete customDataSchema by id", function () {
        var newCustomDataSchema = { orgId: testOrgId, contentType: testContentType1, title: 'Some title here', content: 'this customDataSchema is to be deleted'};
        var createPromise = customDataSchemaService.create(newCustomDataSchema);

        createPromise.then(function(doc) {
            var id = doc.id;
            customDataSchemaService.delete(doc.id).then(function(result) {
                customDataSchemaService.getById(id).then(function(retrievedDoc) {
                    retrievedDoc.should.eventually.equal(undefined);
                });
            });
        });
    });

    function deleteAllTestSchema() {
        return database.customDataSchema.remove({orgId: testOrgId});
    }
});

