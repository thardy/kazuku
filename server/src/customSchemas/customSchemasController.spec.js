import _ from 'lodash';
import config from '../server/config/index.js';
import express from 'express';
import app from '../app.js';
import supertest from 'supertest';
const request = supertest(`http://${config.hostname}:${config.port}`);
import chai from 'chai';
const should = chai.Should();
const expect = chai.expect;
import moment from 'moment';
import testHelper from '../common/testHelper.js';
import utils from '../utils/index.js';

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import chaiThings from 'chai-things';
chai.use(chaiThings);

describe("ApiTests", function () {

    let server = {};

    before(() => {
        // start express server
        server = app.listen(config.port, () => {
            console.log(`kazuku server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
        });

        // Insert some docs to be present before all tests start
        return testHelper.setupTestSchemas();
    });

    after(() => {
        // shutdown express server
        server.close();

        // Remove everything we created
        return testHelper.deleteAllTestSchemas();
    });

    describe("customSchemasController", function () {

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

            describe("getAll", function () {
                it("should return all customSchemas for a given org", function () {
                    return request
                        .get('/api/customschemas')
                        .set('Cookie', [authCookie])
                        .set('Authorization', authorizationHeaderValue)
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
                    return request
                        .get('/api/customschemas/{0}'.format(testHelper.existingSchemas[0].contentType))
                        .set('Cookie', [authCookie])
                        .set('Authorization', authorizationHeaderValue)
                        .expect(200)
                        .then(function (result) {
                            var schema = result.body;
                            schema.should.have.property("jsonSchema").deep.equal(testHelper.existingSchemas[0].jsonSchema);
                        });
                });
                it("should return a 204 for a contentType that is not found", function () {
                    var badContentType = "123456789012";
                    return request
                        .get('/api/customschemas/{0}'.format(badContentType))
                        .set('Cookie', [authCookie])
                        .set('Authorization', authorizationHeaderValue)
                        .expect(204);
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
                    return request
                        .post(relativeUrl)
                        .set('Cookie', [authCookie])
                        .set('Authorization', authorizationHeaderValue)
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
                    return request
                        .post('/api/customschemas')
                        .set('Cookie', [authCookie])
                        .set('Authorization', authorizationHeaderValue)
                        .send(invalidCustomSchema)
                        .expect(400);
                });
                it("should return a 409 for duplicate key errors", function () {
                    var body = {
                        orgId: testHelper.existingSchemas[0].orgId,
                        contentType: testHelper.existingSchemas[0].contentType,
                        jsonSchema: {}
                    };
                    return request
                        .post('/api/customschemas')
                        .set('Cookie', [authCookie])
                        .set('Authorization', authorizationHeaderValue)
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
                    return request
                        .put(relativeUrl)
                        .set('Cookie', [authCookie])
                        .set('Authorization', authorizationHeaderValue)
                        .send(updatedSchema)
                        .expect(200)
                        .then(function(result) {
                            // verify customSchema was updated
                            return request
                                .get('/api/customschemas/{0}'.format(testHelper.existingSchemas[1].contentType))
                                .set('Cookie', [authCookie])
                                .set('Authorization', authorizationHeaderValue)
                                .expect(200)
                                .then(function (result) {
                                    var schema = result.body;
                                    schema.should.have.property("jsonSchema").deep.equal(updatedSchema.jsonSchema);
                                });
                        });
                });
                it("should return 204 for a non-existent contentType", function () {
                    var body = {
                        jsonSchema: {}
                    };

                    // 557f30402598f1243c14403c
                    var relativeUrl = '/api/customschemas/{0}'.format('nonExistentContentType');
                    return request
                        .put(relativeUrl)
                        .set('Cookie', [authCookie])
                        .set('Authorization', authorizationHeaderValue)
                        .send(body)
                        .expect(204);
                });
            });
            describe("delete", function () {
                it("should delete an existing customSchema", function () {
                    var id = testHelper.existingSchemas[1].id;
                    return request
                        .delete('/api/customschemas/{0}'.format(testHelper.existingSchemas[1].contentType))
                        .set('Cookie', [authCookie])
                        .set('Authorization', authorizationHeaderValue)
                        .expect(204)
                        .then(function(result) {
                            // verify customData was deleted
                            return request
                                .get('/api/customschemas/{0}'.format(testHelper.existingSchemas[1]))
                                .set('Cookie', [authCookie])
                                .set('Authorization', authorizationHeaderValue)
                                .expect(204);
                        });
                });
                it("should return 204 for a non-existent contentType", function () {
                    var relativeUrl = '/api/customschemas/{0}'.format('nonExistentContentType');
                    return request
                        .delete(relativeUrl)
                        .set('Cookie', [authCookie])
                        .set('Authorization', authorizationHeaderValue)
                        .expect(204);
                });
            });
        });
    });
});


