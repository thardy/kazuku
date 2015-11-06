var CustomSchemaService = require("./customSchemaService");
var Promise = require("bluebird");
var database = require("../database/database");
var _ = require("lodash");
var chai = require("chai");
var should = chai.Should();
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var moment = require("moment");

chai.use(chaiAsPromised);

describe("CustomSchemaService CRUD", function () {
    var customSchemaService = {};
    var existingCustomSchema1 = {};
    var existingCustomSchema2= {};
    var theUpdatedCustomSchema = {};
    var testOrgId = 1;
    var testContentType1 = 'testType1';
    var testContentType2 = 'testType2';

    before(function () {
        customSchemaService = new CustomSchemaService(database);
        // Insert some docs to be present before all tests start
        // All test data should belong to a specific orgId (a test org)
        var newCustomSchema1 = {
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
        var newCustomSchema2 = {
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
                return database.customSchemas.insert(newCustomSchema1);
            })
            .then(function(doc) {
                existingCustomSchema1 = doc;
                existingCustomSchema1.id = existingCustomSchema1._id.toHexString();
                return doc;
            })
            .then(function(result) {
                return database.customSchemas.insert(newCustomSchema2);
            })
            .then(function(doc) {
                existingCustomSchema2 = doc;
                existingCustomSchema2.id = existingCustomSchema2._id.toHexString();
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

    // todo: alter to enforce orgId (preferably in genericService). Add orgId to all service function parms, have controller pull orgId from auth mechanism.
    it("can get all customSchemas", function () {
        var getAllPromise = customSchemaService.getAll();

        return Promise.all([
            getAllPromise.should.eventually.be.instanceOf(Array),
            getAllPromise.should.eventually.have.length.greaterThan(1)
        ]);
    });

    it("can get customSchemas by Id", function () {
        var getById = customSchemaService.getById(existingCustomSchema1.id);

        return getById.should.eventually.have.property("jsonSchema").deep.equal(existingCustomSchema1.jsonSchema);
    });

    it("can get customSchemas by ContentType", function () {
        var getByContentTypePromise = customSchemaService.getByContentType(testContentType2);

        return Promise.all([
            getByContentTypePromise.should.eventually.be.an("object"),
            getByContentTypePromise.should.eventually.have.property("jsonSchema").deep.equal(existingCustomSchema2.jsonSchema)
        ]);
    });

    it("can create customSchemas", function () {
        var createdContentType = "newlyCreatedSchemaType";
        var now = moment().format('hmmss');
        var testFieldName = 'TestField' + now;
        var myJsonSchema = {
            "type": "object",
            "properties": {
                "someField": {
                    "type": "string",
                    "name": testFieldName,
                    "title": "Some Field"
                }
            }
        };
        var customSchema = {
            orgId: testOrgId,
            contentType: createdContentType,
            jsonSchema: myJsonSchema
        };

        var createPromise = customSchemaService.create(customSchema);

        return Promise.all([
            createPromise.should.eventually.be.an("object"),
            createPromise.should.eventually.have.property("contentType", createdContentType),
            createPromise.should.eventually.have.property("jsonSchema", myJsonSchema)
        ]);
    });

    it("validates customSchemas on create using base validation - orgId", function () {
        var now = moment().format('hmmss');
        var testFieldName = 'TestField' + now;
        var myJsonSchema = {
            "type": "object",
            "properties": {
                "someField": {
                    "type": "string",
                    "name": testFieldName,
                    "title": "Some Field"
                }
            }
        };
        var invalidCustomSchema = {
            contentType: testContentType2,
            jsonSchema: myJsonSchema
        };

        var createPromise = customSchemaService.create(invalidCustomSchema);

        return createPromise.should.be.rejectedWith(TypeError, "Need orgId");
    });

    it("validates customSchemas on create using extended validation - contentType and jsonSchema", function () {
        var invalidCustomSchema = {
            orgId: testOrgId,
            contentType: testContentType2
        };

        var createPromise = customSchemaService.create(invalidCustomSchema);

        return createPromise.should.be.rejectedWith(TypeError, "Need contentType and jsonSchema");
    });

    it("can update customSchemas by id", function () {
        var fieldName = "updatedField";
        var myJsonSchema = {
            "type": "object",
            "properties": {
                "updatedField": {
                    "type": "string",
                    "name": fieldName,
                    "title": "Updated Field"
                }
            }
        };
        var theUpdatedCustomSchema = {
            jsonSchema: myJsonSchema
        };

        var updateByIdPromise = customSchemaService.updateById(existingCustomSchema1.id, theUpdatedCustomSchema);

        return updateByIdPromise.then(function(numAffected) {
            numAffected.should.equal(1);

            // verify customSchema was updated
            var getByIdPromise = customSchemaService.getById(existingCustomSchema1.id);

            return getByIdPromise.should.eventually.have.property("jsonSchema").deep.equal(myJsonSchema);
        });
    });

    it("can delete customSchemas by id", function () {
        var createdContentType = "typeToBeDeleted";
        var myJsonSchema = {
            "type": "object",
            "properties": {
                "someField": {
                    "type": "string",
                    "name": "someField",
                    "title": "Some Field"
                }
            }
        };
        var newCustomSchema = {
            orgId: testOrgId,
            contentType: createdContentType,
            jsonSchema: myJsonSchema
        };

        var createPromise = customSchemaService.create(newCustomSchema);

        return createPromise.then(function(doc) {
            var id = doc.id;
            return customSchemaService.delete(doc.id).then(function(result) {
                return customSchemaService.getById(id).then(function(retrievedDoc) {
                    return expect(retrievedDoc).to.equal(null);
                });
            });
        });
    });

    function deleteAllTestSchema() {
        return database.customSchemas.remove({orgId: testOrgId});
    }
});

