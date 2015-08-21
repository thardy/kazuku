var CustomDataSchemaService = require("./customDataSchemaService");
var Promise = require("bluebird");
var database = require("../database/database");
var _ = require("lodash");
var chai = require("chai");
var should = chai.Should();
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var moment = require("moment");

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

    // todo: alter to enforce orgId (preferably in genericService)
    it("can get all Schemas", function () {
        var getAllPromise = customDataSchemaService.getAll();

        return Promise.all([
            getAllPromise.should.eventually.be.instanceOf(Array),
            getAllPromise.should.eventually.have.length.greaterThan(1)
        ]);
    });

    it("can get customDataSchema by Id", function () {
        var getByTypeAndId = customDataSchemaService.getById(existingCustomDataSchema1.id);

        getByTypeAndId.should.eventually.have.property("jsonSchema", existingCustomDataSchema1.jsonSchema);
    });

    it("can get schema by ContentType", function () {
        var getByContentTypePromise = customDataSchemaService.getByContentType(testContentType2);

        return Promise.all([
            getByContentTypePromise.should.eventually.be.an("object"),
            getByContentTypePromise.should.eventually.have.property("jsonSchema").deep.equal(existingCustomDataSchema2.jsonSchema)
        ]);
    });

    it("can create customDataSchema", function () {
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
        var customDataSchema = {
            orgId: testOrgId,
            contentType: createdContentType,
            jsonSchema: myJsonSchema
        };

        var createPromise = customDataSchemaService.create(customDataSchema);

        return Promise.all([
            createPromise.should.eventually.be.an("object"),
            createPromise.should.eventually.have.property("contentType", createdContentType),
            createPromise.should.eventually.have.property("jsonSchema", myJsonSchema)
        ]);
    });

    it("validates customDataSchema on create using base validation - orgId", function () {
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
        var invalidCustomDataSchema = {
            contentType: testContentType2,
            jsonSchema: myJsonSchema
        };

        var createPromise = customDataSchemaService.create(invalidCustomDataSchema);

        return createPromise.should.be.rejectedWith(TypeError, "Need orgId");
    });

    it("validates customDataSchema on create using extended validation - contentType and jsonSchema", function () {
        var invalidCustomDataSchema = {
            orgId: testOrgId,
            contentType: testContentType2
        };

        var createPromise = customDataSchemaService.create(invalidCustomDataSchema);

        return createPromise.should.be.rejectedWith(TypeError, "Need contentType and jsonSchema");
    });

    it("can update customDataSchema by id", function () {
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
        var theUpdatedCustomDataSchema = {
            jsonSchema: myJsonSchema
        };

        var updateByIdPromise = customDataSchemaService.updateById(existingCustomDataSchema1.id, theUpdatedCustomDataSchema);

        updateByIdPromise.then(function(numAffected) {
            numAffected.should.equal(1);

            // verify customDataSchema was updated
            var getByIdPromise = customDataSchemaService.getById(existingCustomDataSchema1.id);

            getByIdPromise.should.eventually.have.property("jsonSchema", myJsonSchema);
        });
    });

    it("can delete customDataSchema by id", function () {
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
        var newCustomDataSchema = {
            orgId: testOrgId,
            contentType: createdContentType,
            jsonSchema: myJsonSchema
        };

        var createPromise = customDataSchemaService.create(newCustomDataSchema);

        createPromise.then(function(doc) {
            var id = doc.id;
            customDataSchemaService.delete(doc.id).then(function(result) {
                customDataSchemaService.getByTypeAndId(createdContentType, id).then(function(retrievedDoc) {
                    retrievedDoc.should.eventually.equal(undefined);
                });
            });
        });
    });

    function deleteAllTestSchema() {
        return database.customDataSchema.remove({orgId: testOrgId});
    }
});

