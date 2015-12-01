var _ = require("lodash");
var express = require("express");
var request = require("supertest-as-promised");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;
var moment = require("moment");
var testHelper = require("../common/testHelper");

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
                // todo: Implement this as soon as I get auth working
//                it("should return a 500 if I specify an orgId different than my actual orgId", function () {
//                    var someString = 'Thursday';
//                    var someNum = 22;
//                    var body = {
//                        orgId: testHelper.testOrgId,
//                        contentType: testHelper.testContentType,
//                        someString: someString,
//                        someNum: someNum
//                    };
//
//                    var relativeUrl = '/api/customschemas';
//                    return request(testHelper.apiUrl)
//                        .post(relativeUrl)
//                        .send(body)
//                        .expect(201)
//                        .then(function(result) {
//                            result.body.should.have.property('_id');
//                            result.body.should.have.property('id');
//                            result.body.someString.should.equal(someString);
//                            result.body.someNum.should.equal(someNum);
//                        });
//                });
//                it("should return a 400 for validation error", function () {
//                    var badData = "somethingbadgoeshere";
//                    return request(testHelper.apiUrl)
//                        .post('/api/customschemas')
//                        .send(body)
//                        .expect(400);
//                });
//                it("should return a 409 for duplicate key errors", function () {
//                    var body = {
//                        orgId: testHelper.testOrgId,
//                        contentType: testHelper.testProductsContentType
//                    };
//                    return request(testHelper.apiUrl)
//                        .post('/api/customschemas')
//                        .send(body)
//                        .expect(409);
//                });
            });
            describe("update", function () {
                it("should update an existing customSchema", function () {
                    var updatedPrice = 1999.99;
                    var updatedQuantity = 3;
                    var body = {
                        price: updatedPrice,
                        quantity: updatedQuantity
                    };

                    var relativeUrl = '/api/customschemas/{0}'.format(testHelper.existingSchemas[2].contentType);
                    return request(testHelper.apiUrl)
                        .put(relativeUrl)
                        .send(body)
                        .expect(200)
                        .then(function(result) {
                            // verify customData was updated
                            return request(testHelper.apiUrl)
                                .get('/api/customschemas/{0}'.format(testHelper.existingSchemas[2].contentType))
                                .expect(200)
                                .then(function (result) {
                                    var product = result.body;
                                    product.name.should.equal(testHelper.existingSchemas[2].name);
                                    product.price.should.equal(updatedPrice);
                                    product.quantity.should.equal(updatedQuantity);
                                });
                        });
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
            });
        });
    });
});


