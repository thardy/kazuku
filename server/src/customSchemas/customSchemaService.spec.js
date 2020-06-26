import CustomSchemaService from './customSchemaService.js';
import Promise from 'bluebird';
import {database} from '../database/database.js';
import _ from 'lodash';
import chai from 'chai';
const should = chai.Should();
import chaiAsPromised from 'chai-as-promised';
const expect = chai.expect;
import moment from 'moment';
import testHelper from '../common/testHelper.js';

chai.use(chaiAsPromised);

const testOrgId = testHelper.testOrgId;

describe("CustomSchemaService CRUD", function () {
    let customSchemaService = {};
    let existingCustomSchema1 = {};
    let existingCustomSchema2= {};
    let theUpdatedCustomSchema = {};
    let testContentType1 = 'testType1';
    let testContentType2 = 'testType2';

    before(function () {
        customSchemaService = new CustomSchemaService(database);
        // Insert some docs to be present before all tests start
        // All test data should belong to a specific orgId (a test org)
        let newCustomSchema1 = {
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
        let newCustomSchema2 = {
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

    it("can get all customSchemas", function () {
        let getAllPromise = customSchemaService.getAll(testOrgId);

        return Promise.all([
            getAllPromise.should.eventually.be.instanceOf(Array),
            getAllPromise.should.eventually.have.length.greaterThan(1)
        ]);
    });

    it("can get customSchemas by Id", function () {
        let getById = customSchemaService.getById(testOrgId, existingCustomSchema1.id);

        return getById.should.eventually.have.property("jsonSchema").deep.equal(existingCustomSchema1.jsonSchema);
    });

    it("can get customSchemas by ContentType", function () {
        let getByContentTypePromise = customSchemaService.getByContentType(testOrgId, testContentType2);

        return Promise.all([
            getByContentTypePromise.should.eventually.be.an("object"),
            getByContentTypePromise.should.eventually.have.property("jsonSchema").deep.equal(existingCustomSchema2.jsonSchema)
        ]);
    });

    it("can create customSchemas", function () {
        let createdContentType = "newlyCreatedSchemaType";
        let now = moment().format('hmmss');
        let testFieldName = 'TestField' + now;
        let myJsonSchema = {
            "type": "object",
            "properties": {
                "someField": {
                    "type": "string",
                    "name": testFieldName,
                    "title": "Some Field"
                }
            }
        };
        let customSchema = {
            orgId: testOrgId,
            contentType: createdContentType,
            jsonSchema: myJsonSchema
        };

        let createPromise = customSchemaService.create(testOrgId, customSchema);

        return Promise.all([
            createPromise.should.eventually.be.an("object"),
            createPromise.should.eventually.have.property("contentType", createdContentType),
            createPromise.should.eventually.have.property("jsonSchema", myJsonSchema)
        ]);
    });

    it("validates customSchemas on create using extended validation - contentType and jsonSchema", function () {
        let invalidCustomSchema = {
            orgId: testOrgId,
            contentType: testContentType2
        };

        let createPromise = customSchemaService.create(testOrgId, invalidCustomSchema);

        return createPromise.should.be.rejectedWith(TypeError, "Need contentType and jsonSchema");
    });

    it("can update customSchemas by contentType", function () {
        let fieldName = "updatedField";
        let myJsonSchema = {
            "type": "object",
            "properties": {
                "updatedField": {
                    "type": "string",
                    "name": fieldName,
                    "title": "Updated Field"
                }
            }
        };
        let theUpdatedCustomSchema = {
            jsonSchema: myJsonSchema
        };

        let updateByContentTypePromise = customSchemaService.updateByContentType(testOrgId, existingCustomSchema1.contentType, theUpdatedCustomSchema);

        return updateByContentTypePromise.then(function(result) {
            result.nModified.should.equal(1);

            // verify customSchema was updated
            let getByContentTypePromise = customSchemaService.getByContentType(testOrgId, existingCustomSchema1.contentType);

            return getByContentTypePromise.should.eventually.have.property("jsonSchema").deep.equal(myJsonSchema);
        });
    });

    it("can delete customSchemas by contentType", function () {
        let createdContentType = "typeToBeDeleted";
        let myJsonSchema = {
            "type": "object",
            "properties": {
                "someField": {
                    "type": "string",
                    "name": "someField",
                    "title": "Some Field"
                }
            }
        };
        let newCustomSchema = {
            orgId: testOrgId,
            contentType: createdContentType,
            jsonSchema: myJsonSchema
        };

        let createPromise = customSchemaService.create(testOrgId, newCustomSchema);

        return createPromise.then(function(doc) {
            return customSchemaService.deleteByContentType(testOrgId, createdContentType).then(function(result) {
                return customSchemaService.getByContentType(testOrgId, createdContentType).then(function(retrievedDoc) {
                    return expect(retrievedDoc).to.equal(null);
                });
            });
        });
    });

    function deleteAllTestSchema() {
        return database.customSchemas.remove({orgId: testOrgId});
    }
});

