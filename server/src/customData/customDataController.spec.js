var _ = require("lodash");
var express = require("express");
var request = require("supertest-as-promised");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;
var moment = require("moment");
var Query = require("rql/query").Query;
var testHelper = require("../common/testHelper");

// todo: consider moving this into a more global spot before running all api-related tests.  See http://beletsky.net/2014/03/testable-apis-with-node-dot-js.html
//  or split mocha tests up somehow, preferably by tag or somesuch instead of by location.
//  Perhaps just leave in each spec until Mocha tagging api is completed, and use that to split up api and non-api test runs.
// Update: I'm currently using grep to run api tests and it's working, but it doesn't address loading this in every spec.
var app = require('../../bin/www'); // This starts up the api server (I'm assuming it shuts down when mocha is done)

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

describe("ApiTests", function () {

    before(function () {
        // Insert some docs to be present before all tests start
        return testHelper.setupTestProducts();
    });

    after(function () {
        // Remove everything we created
        return testHelper.deleteAllTestProducts();
    });

    describe("customDataController", function () {

        describe("when authorized", function () {
            describe("getAll", function () {
                it("should return all customData for a given org and contentType", function () {
                    return request(testHelper.apiUrl)
                        .get('/api/customData/{0}'.format(testHelper.testProductsContentType))
                        .expect(200)
                        .then(function (result) {
                            result.body.length.should.equal(3);
                            var product = _.find(result.body, function(item) {
                                return item.name === testHelper.newProduct1.name;
                            });
                            product.quantity.should.equal(testHelper.newProduct1.quantity);
                        });
                });
            });
            describe("getById", function () {
                it("should return a customData for a given org, contentType, and id", function () {
                    return request(testHelper.apiUrl)
                        .get('/api/customData/{0}/{1}'.format(testHelper.testProductsContentType, testHelper.existingProducts[0].id))
                        .expect(200)
                        .then(function (result) {
                            var product = result.body;
                            product.name.should.equal(testHelper.existingProducts[0].name);
                            product.quantity.should.equal(testHelper.existingProducts[0].quantity);
                        });
                });
            });
            describe("create", function () {
                it("should create a new customData document", function () {
                    var someString = 'Thursday';
                    var someNum = 22;
                    var body = {
                        orgId: testHelper.testOrgId,
                        contentType: testHelper.testProductsContentType,
                        someString: someString,
                        someNum: someNum
                    };

                    var relativeUrl = '/api/customData/{0}'.format(testHelper.testProductsContentType);
                    return request(testHelper.apiUrl)
                        .post(relativeUrl)
                        .send(body)
                        .expect(201)
                        .then(function(result) {
                            result.body.should.have.property('_id');
                            result.body.should.have.property('id');
                            result.body.someString.should.equal(someString);
                            result.body.someNum.should.equal(someNum);
                        });
                });

            });
            describe("update", function () {
                it("should update an existing customData document", function () {
                    var updatedPrice = 1999.99;
                    var updatedQuantity = 3;
                    var body = {
                        price: updatedPrice,
                        quantity: updatedQuantity
                    };

                    var relativeUrl = '/api/customData/{0}/{1}'.format(testHelper.testProductsContentType, testHelper.existingProducts[2].id);
                    return request(testHelper.apiUrl)
                        .put(relativeUrl)
                        .send(body)
                        .expect(200)
                        .then(function(result) {
                            // todo: verify customData was updated - just wait until I alter controller to return the updated object
                            var i = 0;
//                            result.body.should.have.property('_id');
//                            result.body.should.have.property('id');
//                            result.body.price.should.equal(updatedPrice);
//                            result.body.quantity.should.equal(updatedQuantity);
//                            result.body.name.should.equal(testHelper.existingProducts[2].name);
                        });
                });
            });
            describe("delete", function () {
                it("should delete an existing customData document", function () {
                    var id = testHelper.existingProducts[1].id;
                    return request(testHelper.apiUrl)
                        .delete('/api/customData/{0}/{1}'.format(testHelper.testProductsContentType, id))
                        .expect(204)
                        .then(function(result) {
                            // verify customData was deleted
                            return request(testHelper.apiUrl)
                                .get('/api/customData/{0}/{1}'.format(testHelper.testProductsContentType, id))
                                .expect(404);
                        });
                });
            });
        });
    });
});

