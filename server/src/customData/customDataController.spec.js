import _ from 'lodash';
import config from '../server/config/index.js';
import express from 'express';
import app from '../app.js';
import supertest from 'supertest';
const request = supertest(`http://${config.testHostname}:${config.testPort}`);
import chai from 'chai';
const should = chai.Should();
const expect = chai.expect;
import moment from 'moment';
import testHelper from '../common/testHelper.js';

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import chaiThings from 'chai-things';
chai.use(chaiThings);

describe("ApiTests", function () {
    // todo: consider moving this into a more global spot before running all api-related tests.  See http://beletsky.net/2014/03/testable-apis-with-node-dot-js.html
    //  or split mocha tests up somehow, preferably by tag or somesuch instead of by location.
    //  Perhaps just leave in each spec until Mocha tagging api is completed, and use that to split up api and non-api test runs.
    // Update: I'm currently using grep to run api tests and it's working, but it doesn't address loading this in every spec.
    // var app = require('../../bin/www'); // This starts up the api server (I'm assuming it shuts down when mocha is done)
    let server = {};

    before(() => {
        // start express server
        server = app.listen(config.port, () => {
            console.log(`kazuku server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
        });
    });

    after(() => {
        // shutdown express server
        server.close();
    });

    describe("customDataController", function () {

        describe("when authorized", function () {
            let authCookie = {};
            let authorizationHeaderValue = '';

            before(function () {
                return request
                    .post('/api/auth/login')
                    .send({
                        email: 'admin',
                        password: 'test'
                    })
                    .expect(200)
                    .then(response => {
                        // todo: do we still need authCookie at all (does it even exist?)
                        const cookies = response.header['set-cookie'];
                        if (cookies && cookies.length > 0) {
                            authCookie = cookies[0]
                        }
                        if (response.body && response.body.tokens && response.body.tokens.accessToken) {
                            authorizationHeaderValue = `Bearer ${response.body.tokens.accessToken}`;
                        }
                        return response;
                    });
            });

            describe("CRUD", function () {
                before(function () {
                    // Insert some docs to be present before all tests start
                    return testHelper.setupTestProducts()
                        .then((result) => {
                            return testHelper.setupDifferentTestProducts();
                        });
                });

                after(function () {
                    // Remove all test org customData
                    return testHelper.deleteAllTestOrgCustomData();
                });

                describe("getAll", function () {
                    it("should return all customData for a given org", function () {
                        return request
                            .get(`/api/custom-data`)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(200)
                            .then(function (result) {
                                result.body.length.should.equal(testHelper.existingProducts.length + testHelper.existingDifferentProducts.length);
                                var product = _.find(result.body, function(item) {
                                    return item.name === testHelper.differentProduct1.name;
                                });
                                product.quantity.should.equal(testHelper.differentProduct1.quantity);
                            });
                    });
                });
                describe("getAllByContentType", function () {
                    it("should return all customData for a given org and contentType", function () {
                        return request
                            .get('/api/custom-data/{0}'.format(testHelper.testProductsContentType))
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
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
                describe("getByTypeAndId", function () {
                    it("should return a customData for a given org, contentType, and id", function () {
                        return request
                            .get('/api/custom-data/{0}/{1}'.format(testHelper.testProductsContentType, testHelper.existingProducts[0].id))
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(200)
                            .then(function (result) {
                                var product = result.body;
                                product.name.should.equal(testHelper.existingProducts[0].name);
                                product.quantity.should.equal(testHelper.existingProducts[0].quantity);
                            });
                    });
                    it("should return a 204 for an id that is not found", function () {
                        let badId = '111111111111111111111111';
                        return request
                            .get('/api/custom-data/{0}/{1}'.format(testHelper.testProductsContentType, badId))
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(204);
                    });
                    it("should return a 400 for an id that is not a valid ObjectId", function () {
                        var badId = "thisisabadid";
                        return request
                            .get('/api/custom-data/{0}/{1}'.format(testHelper.testProductsContentType, badId))
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(400);
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

                        var relativeUrl = '/api/custom-data/{0}'.format(testHelper.testProductsContentType);
                        return request
                            .post(relativeUrl)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
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
//                    return request
//                        .post('/api/custom-data/{0}'.format(testHelper.testProductsContentType))
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
//                    return request
//                        .post('/api/custom-data/{0}'.format(testHelper.testProductsContentType))
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

                        var relativeUrl = '/api/custom-data/{0}/{1}'.format(testHelper.testProductsContentType, testHelper.existingProducts[2].id);
                        return request
                            .put(relativeUrl)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .send(body)
                            .expect(200)
                            .then(function(result) {
                                // verify customData was updated
                                return request
                                    .get('/api/custom-data/{0}/{1}'.format(testHelper.testProductsContentType, testHelper.existingProducts[2].id))
                                    .set('Cookie', [authCookie])
                                    .set('Authorization', authorizationHeaderValue)
                                    .expect(200)
                                    .then(function (result) {
                                        var product = result.body;
                                        product.name.should.equal(testHelper.existingProducts[2].name);
                                        product.price.should.equal(updatedPrice);
                                        product.quantity.should.equal(updatedQuantity);
                                    });
                            });
                    });
                    it("should return 204 for a non-existent id", function () {
                        var body = {
                            price: 9.99,
                            quantity: 55
                        };
                        // 557f30402598f1243c14403c
                        var relativeUrl = '/api/custom-data/{0}/{1}'.format(testHelper.testProductsContentType, '111111111111111111111111');
                        return request
                            .put(relativeUrl)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .send(body)
                            .expect(204);
                    });
                });
                describe("delete", function () {
                    it("should delete an existing customData document", function () {
                        var id = testHelper.existingProducts[1].id;
                        return request
                            .delete('/api/custom-data/{0}/{1}'.format(testHelper.testProductsContentType, id))
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(204)
                            .then(function(result) {
                                // verify customData was deleted
                                return request
                                    .get('/api/custom-data/{0}/{1}'.format(testHelper.testProductsContentType, id))
                                    .set('Cookie', [authCookie])
                                    .set('Authorization', authorizationHeaderValue)
                                    .expect(204);
                            });
                    });
                    it("should return 400 for a invalid ObjectId", function () {
                        var relativeUrl = '/api/custom-data/{0}/{1}'.format(testHelper.testProductsContentType, 123456789012);
                        return request
                            .delete(relativeUrl)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(400);
                    });
                    it("should return 204 for a non-existent id", function () {
                        var relativeUrl = '/api/custom-data/{0}/{1}'.format(testHelper.testProductsContentType, '111111111111111111111111');
                        return request
                            .delete(relativeUrl)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(204);
                    });
                });
            });

            // todo: RQL was removed as our query language and replaced with GraphQL. Replace these with GraphQL tests
            // describe("RQL", function () {
            //     before(function () {
            //         // Insert some docs to be present before all tests start
            //         return testHelper.setupTestProducts();
            //     });
            //
            //     after(function () {
            //         // Remove everything we created
            //         return testHelper.deleteAllTestProducts();
            //     });
            //
            //     it("can query custom number fields by value", function () {
            //         var query = 'quantity={0}'.format(testHelper.newProduct1.quantity);
            //         return request
            //             .get('/api/custom-data/{0}?{1}'.format(testHelper.testProductsContentType, query))
            //             .set('Cookie', [authCookie])
            //             .set('Authorization', authorizationHeaderValue)
            //             .expect(200)
            //             .then(function (result) {
            //                 result.body.length.should.equal(1);
            //                 var product = result.body[0];
            //                 product.quantity.should.equal(testHelper.newProduct1.quantity);
            //                 product.name.should.equal(testHelper.newProduct1.name);
            //             });
            //     });
            //     it("can query custom number fields greater than value", function () {
            //         var query = 'quantity=gt={0}'.format(90);
            //         return request
            //             .get('/api/custom-data/{0}?{1}'.format(testHelper.testProductsContentType, query))
            //             .set('Cookie', [authCookie])
            //             .set('Authorization', authorizationHeaderValue)
            //             .expect(200)
            //             .then(function (result) {
            //                 result.body.length.should.equal(1);
            //                 var product = result.body[0];
            //                 product.name.should.equal(testHelper.newProduct1.name);
            //             });
            //     });
            //     it("can query custom number fields greater than value with a sort", function () {
            //         var query = 'price=gt={0}&sort(price)'.format(10.00);
            //         return request
            //             .get('/api/custom-data/{0}?{1}'.format(testHelper.testProductsContentType, query))
            //             .set('Cookie', [authCookie])
            //             .set('Authorization', authorizationHeaderValue)
            //             .expect(200)
            //             .then(function (result) {
            //                 result.body.length.should.equal(2);
            //                 var product1 = result.body[0];
            //                 var product2 = result.body[1];
            //                 product1.name.should.equal(testHelper.newProduct3.name);
            //                 product2.name.should.equal(testHelper.newProduct2.name);
            //             });
            //     });
            //     it("can query custom number fields in range", function () {
            //         var query = 'price=ge={0}&price=le={1}&sort(price)'.format(5.50, 20.00);
            //         return request
            //             .get('/api/custom-data/{0}?{1}'.format(testHelper.testProductsContentType, query))
            //             .set('Cookie', [authCookie])
            //             .set('Authorization', authorizationHeaderValue)
            //             .expect(200)
            //             .then(function (result) {
            //                 result.body.length.should.equal(2);
            //                 var product1 = result.body[0];
            //                 var product2 = result.body[1];
            //                 product1.name.should.equal(testHelper.newProduct1.name);
            //                 product2.name.should.equal(testHelper.newProduct3.name);
            //             });
            //     });
            //
            //     it("can query custom date fields by value", function () {
            //         var findDate = moment(testHelper.newProduct2.created).toISOString(); //'2015-06-10T00:00:00Z';
            //         var query = 'created=date:{0}'.format(findDate);
            //         return request
            //             .get('/api/custom-data/{0}?{1}'.format(testHelper.testProductsContentType, query))
            //             .set('Cookie', [authCookie])
            //             .set('Authorization', authorizationHeaderValue)
            //             .expect(200)
            //             .then(function (result) {
            //                 result.body.length.should.equal(1);
            //                 var product = result.body[0];
            //                 product.name.should.equal(testHelper.newProduct2.name);
            //             });
            //     });
            //     it("can query custom date fields greater than value", function () {
            //         // todo: RQL gt is not working.  Either fix or switch to another query framework, like GraphQL.
            //         var findDate = '2014-01-01';
            //         var query = 'created=gt=date:{0}&sort(-created)'.format(findDate);
            //         return request
            //             .get('/api/custom-data/{0}?{1}'.format(testHelper.testProductsContentType, query))
            //             .set('Cookie', [authCookie])
            //             .set('Authorization', authorizationHeaderValue)
            //             .expect(200)
            //             .then(function (result) {
            //                 result.body.length.should.equal(2);
            //                 var product1 = result.body[0];
            //                 var product2 = result.body[1];
            //                 product1.name.should.equal(testHelper.newProduct2.name);
            //                 product2.name.should.equal(testHelper.newProduct3.name);
            //             });
            //     });
            //     it("can query custom date fields within range", function () {
            //         var startDate = '2015-01-27';
            //         var endDate = '2015-05-20';
            //         var query = 'created=ge=date:{0}&created=le=date:{1}&sort(-created)'.format(startDate, endDate);
            //         return request
            //             .get('/api/custom-data/{0}?{1}'.format(testHelper.testProductsContentType, query))
            //             .set('Cookie', [authCookie])
            //             .set('Authorization', authorizationHeaderValue)
            //             .expect(200)
            //             .then(function (result) {
            //                 result.body.length.should.equal(2);
            //                 var product1 = result.body[0];
            //                 var product2 = result.body[1];
            //                 product1.name.should.equal(testHelper.newProduct2.name);
            //                 product2.name.should.equal(testHelper.newProduct3.name);
            //             });
            //     });
            // });
        });
    });
});

