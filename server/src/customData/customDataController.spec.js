var _ = require("lodash");
var express = require("express");
var request = require("supertest-as-promised");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;
var moment = require("moment");
var testHelper = require("../common/testHelper");

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

describe("ApiTests", function () {
    // todo: consider moving this into a more global spot before running all api-related tests.  See http://beletsky.net/2014/03/testable-apis-with-node-dot-js.html
    //  or split mocha tests up somehow, preferably by tag or somesuch instead of by location.
    //  Perhaps just leave in each spec until Mocha tagging api is completed, and use that to split up api and non-api test runs.
    // Update: I'm currently using grep to run api tests and it's working, but it doesn't address loading this in every spec.
    var app = require('../../bin/www'); // This starts up the api server (I'm assuming it shuts down when mocha is done)


    describe("customDataController", function () {

        describe("when authorized", function () {
            describe("CRUD", function () {
                before(function () {
                    // Insert some docs to be present before all tests start
                    return testHelper.setupTestProducts();
                });

                after(function () {
                    // Remove everything we created
                    return testHelper.deleteAllTestProducts();
                });

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
                    it("should return a 404 for an id that is not found", function () {
                        var badId = "thisisabadid";
                        return request(testHelper.apiUrl)
                            .get('/api/customData/{0}/{1}'.format(testHelper.testProductsContentType, badId))
                            .expect(404);
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
                    // There are currently no validation errors for customData, since it can be anything
//                it("should return a 400 for validation error", function () {
//                    var badData = "somethingbadgoeshere";
//                    return request(testHelper.apiUrl)
//                        .post('/api/customData/{0}'.format(testHelper.testProductsContentType))
//                        .send(body)
//                        .expect(400);
//                });
                    // There's no way to try to insert a duplicate key with CustomData (you can't specify an id in the create,
                    //  and there aren't any unique key constraints that don't involve id)
//                it("should return a 409 for duplicate key errors", function () {
//                    var body = {
//                        orgId: testHelper.testOrgId,
//                        contentType: testHelper.testProductsContentType
//                    };
//                    return request(testHelper.apiUrl)
//                        .post('/api/customData/{0}'.format(testHelper.testProductsContentType))
//                        .send(body)
//                        .expect(409);
//                });
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
                                // verify customData was updated
                                return request(testHelper.apiUrl)
                                    .get('/api/customData/{0}/{1}'.format(testHelper.testProductsContentType, testHelper.existingProducts[2].id))
                                    .expect(200)
                                    .then(function (result) {
                                        var product = result.body;
                                        product.name.should.equal(testHelper.existingProducts[2].name);
                                        product.price.should.equal(updatedPrice);
                                        product.quantity.should.equal(updatedQuantity);
                                    });
                            });
                    });
                    it("should return 404 for a non-existent id", function () {
                        var body = {
                            price: 9.99,
                            quantity: 55
                        };
                        // 557f30402598f1243c14403c
                        var relativeUrl = '/api/customData/{0}/{1}'.format(testHelper.testProductsContentType, 123456789012);
                        return request(testHelper.apiUrl)
                            .put(relativeUrl)
                            .send(body)
                            .expect(404);
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
                    it("should return 404 for a non-existent id", function () {
                        var relativeUrl = '/api/customData/{0}/{1}'.format(testHelper.testProductsContentType, 123456789012);
                        return request(testHelper.apiUrl)
                            .delete(relativeUrl)
                            .expect(404);
                    });
                });
            });

            describe("RQL", function () {
                before(function () {
                    // Insert some docs to be present before all tests start
                    return testHelper.setupTestProducts();
                });

                after(function () {
                    // Remove everything we created
                    return testHelper.deleteAllTestProducts();
                });

                it("can query custom number fields by value", function () {
                    var query = 'quantity={0}'.format(testHelper.newProduct1.quantity);
                    return request(testHelper.apiUrl)
                        .get('/api/customData/{0}?{1}'.format(testHelper.testProductsContentType, query))
                        .expect(200)
                        .then(function (result) {
                            result.body.length.should.equal(1);
                            var product = result.body[0];
                            product.quantity.should.equal(testHelper.newProduct1.quantity);
                            product.name.should.equal(testHelper.newProduct1.name);
                        });
                });
                it("can query custom number fields greater than value", function () {
                    var query = 'quantity=gt={0}'.format(90);
                    return request(testHelper.apiUrl)
                        .get('/api/customData/{0}?{1}'.format(testHelper.testProductsContentType, query))
                        .expect(200)
                        .then(function (result) {
                            result.body.length.should.equal(1);
                            var product = result.body[0];
                            product.name.should.equal(testHelper.newProduct1.name);
                        });
                });
                it("can query custom number fields greater than value with a sort", function () {
                    var query = 'price=gt={0}&sort(price)'.format(10.00);
                    return request(testHelper.apiUrl)
                        .get('/api/customData/{0}?{1}'.format(testHelper.testProductsContentType, query))
                        .expect(200)
                        .then(function (result) {
                            result.body.length.should.equal(2);
                            var product1 = result.body[0];
                            var product2 = result.body[1];
                            product1.name.should.equal(testHelper.newProduct3.name);
                            product2.name.should.equal(testHelper.newProduct2.name);
                        });
                });
                it("can query custom number fields in range", function () {
                    var query = 'price=ge={0}&price=le={1}&sort(price)'.format(5.50, 20.00);
                    return request(testHelper.apiUrl)
                        .get('/api/customData/{0}?{1}'.format(testHelper.testProductsContentType, query))
                        .expect(200)
                        .then(function (result) {
                            result.body.length.should.equal(2);
                            var product1 = result.body[0];
                            var product2 = result.body[1];
                            product1.name.should.equal(testHelper.newProduct1.name);
                            product2.name.should.equal(testHelper.newProduct3.name);
                        });
                });

                it("can query custom date fields by value", function () {
                    var findDate = moment(testHelper.newProduct2.created).toISOString(); //'2015-06-10T00:00:00Z';
                    var query = 'created=date:{0}'.format(findDate);
                    return request(testHelper.apiUrl)
                        .get('/api/customData/{0}?{1}'.format(testHelper.testProductsContentType, query))
                        .expect(200)
                        .then(function (result) {
                            result.body.length.should.equal(1);
                            var product = result.body[0];
                            product.name.should.equal(testHelper.newProduct2.name);
                        });
                });
                it("can query custom date fields greater than value", function () {
                    var findDate = '2014-01-01';
                    var query = 'created=gt=date:{0}&sort(-created)'.format(findDate);
                    return request(testHelper.apiUrl)
                        .get('/api/customData/{0}?{1}'.format(testHelper.testProductsContentType, query))
                        .expect(200)
                        .then(function (result) {
                            result.body.length.should.equal(2);
                            var product1 = result.body[0];
                            var product2 = result.body[1];
                            product1.name.should.equal(testHelper.newProduct2.name);
                            product2.name.should.equal(testHelper.newProduct3.name);
                        });
                });
                it("can query custom date fields within range", function () {
                    var startDate = '2015-01-27';
                    var endDate = '2015-05-20';
                    var query = 'created=ge=date:{0}&created=le=date:{1}&sort(-created)'.format(startDate, endDate);
                    return request(testHelper.apiUrl)
                        .get('/api/customData/{0}?{1}'.format(testHelper.testProductsContentType, query))
                        .expect(200)
                        .then(function (result) {
                            result.body.length.should.equal(2);
                            var product1 = result.body[0];
                            var product2 = result.body[1];
                            product1.name.should.equal(testHelper.newProduct2.name);
                            product2.name.should.equal(testHelper.newProduct3.name);
                        });
                });
            });
        });
    });
});

