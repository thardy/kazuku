var _ = require("lodash");
var express = require("express");
var request = require("supertest-as-promised");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;
var moment = require("moment");
var testHelper = require("../common/testHelper");
var utils = require('../utils/index');

// todo: consider moving this into a more global spot before running all api-related tests.  See http://beletsky.net/2014/03/testable-apis-with-node-dot-js.html
var app = require('../../bin/www'); // This starts up the api server (I'm assuming it shuts down when mocha is done)

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

describe("ApiTests", function () {

    before(function () {
        // Insert some docs to be present before all tests start
        return testHelper.setupTestSchemas();
    });

    after(function () {
        // Remove everything we created
        return testHelper.deleteAllTestSchemas();
    });

    describe("customSchemasController", function () {

        describe("when authorized", function () {
            describe("getAll", function () {
                it("should return all customSchemas for a given org", function () {
                    return request(testHelper.apiUrl)
                        .get('/api/customschemas')
                        .expect(200)
                        .then(function (result) {
                            result.body.length.should.equal(2);
                            var schema = _.find(result.body, function(item) {
                                return item.contentType === testHelper.existingSchemas[0].contentType;
                            });
                            schema.should.have.property("jsonSchema").deep.equal(testHelper.existingSchemas[0].jsonSchema);
                        });
                });
            });
            describe("getByContentType", function () {
                it("should return a customSchema for a given org and contentType", function () {
                    return request(testHelper.apiUrl)
                        .get('/api/customschemas/{0}'.format(testHelper.existingSchemas[0].contentType))
                        .expect(200)
                        .then(function (result) {
                            var schema = result.body;
                            schema.should.have.property("jsonSchema").deep.equal(testHelper.existingSchemas[0].jsonSchema);
                        });
                });
                it("should return a 404 for a contentType that is not found", function () {
                    var badContentType = "123456789012";
                    return request(testHelper.apiUrl)
                        .get('/api/customschemas/{0}'.format(badContentType))
                        .expect(404);
                });
            });
            describe("create", function () {
                it("should create a new customSchema", function () {
                    var newContentType = 'supafly';
                    var someFieldName = 'chickenField';
                    var newSchema = {
                        orgId: testHelper.testOrgId,
                        contentType: newContentType,
                        jsonSchema: {
                            "type": "object",
                            "properties": {
                                chickenField: {
                                    "type": "string",
                                    "name": someFieldName,
                                    "title": "Chicken Field"
                                }
                            }
                        }
                    };

                    var relativeUrl = '/api/customschemas';
                    return request(testHelper.apiUrl)
                        .post(relativeUrl)
                        .send(newSchema)
                        .expect(201)
                        .then(function(result) {
                            result.body.should.have.property('_id');
                            result.body.should.have.property('id');
                            result.body.contentType.should.equal(newContentType);
                            result.body.should.have.property("jsonSchema").deep.equal(newSchema.jsonSchema);
                        });
                });
                it("should return a 400 for validation error", function () {
                    var invalidCustomSchema = {
                        contentType: testHelper.testContentType2
                    };
                    return request(testHelper.apiUrl)
                        .post('/api/customschemas')
                        .send(invalidCustomSchema)
                        .expect(400);
                });
                it("should return a 409 for duplicate key errors", function () {
                    var body = {
                        orgId: testHelper.existingSchemas[0].orgId,
                        contentType: testHelper.existingSchemas[0].contentType,
                        jsonSchema: {}
                    };
                    return request(testHelper.apiUrl)
                        .post('/api/customschemas')
                        .send(body)
                        .expect(409);
                });
            });
            describe("update", function () {
                it("should update an existing customSchema", function () {
                    var updatedFieldName = 'iAmUpdated';
                    var updatedSchema = {
                        jsonSchema: {
                            "type": "object",
                            "properties": {
                                "someString": {
                                    "type": "string",
                                    "name": updatedFieldName,
                                    "title": "Some String"
                                }
                            }
                        }
                    };

                    var relativeUrl = '/api/customschemas/{0}'.format(testHelper.existingSchemas[1].contentType);
                    return request(testHelper.apiUrl)
                        .put(relativeUrl)
                        .send(updatedSchema)
                        .expect(200)
                        .then(function(result) {
                            // verify customSchema was updated
                            return request(testHelper.apiUrl)
                                .get('/api/customschemas/{0}'.format(testHelper.existingSchemas[1].contentType))
                                .expect(200)
                                .then(function (result) {
                                    var schema = result.body;
                                    schema.should.have.property("jsonSchema").deep.equal(updatedSchema.jsonSchema);
                                });
                        });
                });
                it("should return 404 for a non-existent contentType", function () {
                    var body = {
                        jsonSchema: {}
                    };

                    // 557f30402598f1243c14403c
                    var relativeUrl = '/api/customschemas/{0}'.format('nonExistentContentType');
                    return request(testHelper.apiUrl)
                        .put(relativeUrl)
                        .send(body)
                        .expect(404);
                });
            });
            describe("delete", function () {
                it("should delete an existing customSchema", function () {
                    var id = testHelper.existingSchemas[1].id;
                    return request(testHelper.apiUrl)
                        .delete('/api/customschemas/{0}'.format(testHelper.existingSchemas[1].contentType))
                        .expect(204)
                        .then(function(result) {
                            // verify customData was deleted
                            return request(testHelper.apiUrl)
                                .get('/api/customschemas/{0}'.format(testHelper.existingSchemas[1]))
                                .expect(404);
                        });
                });
                it("should return 404 for a non-existent contentType", function () {
                    var relativeUrl = '/api/customData/{0}'.format('nonExistentContentType');
                    return request(testHelper.apiUrl)
                        .delete(relativeUrl)
                        .expect(404);
                });
            });
        });
    });
});


