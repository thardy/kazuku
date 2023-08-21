import _ from 'lodash';
import config from '../server/config/index.js';
import app from '../app.js';
import supertest from 'supertest';
const request = supertest(`http://${config.hostname}:${config.port}`);
import chai from 'chai';
const should = chai.Should();
const expect = chai.expect;
import moment from 'moment';
import {database} from '../database/database.js';

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
    });

    after(() => {
        // shutdown express server
        server.close();
    });

    describe("organizationsController", function () {

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
                let testOrgPrefix = '00TestOrg00-';
                let existingOrgs = [];

                before(function () {
                    let newOrg1 = { name: `${testOrgPrefix}Acme Corp`, code: `${testOrgPrefix}acmecorp`, description: 'A cool company.', statusId: 1, isMetaOrg: false };
                    let newOrg2 = { name: `${testOrgPrefix}Org to Update`, code: `${testOrgPrefix}updateorg`, description: 'A good org to update.', statusId: 1, isMetaOrg: false };

                    return deleteAllTestOrganizations()
                        .then(function(result) {
                            return database.organizations.insert([newOrg1, newOrg2]);
                        })
                        .then(function(docs) {
                            existingOrgs = docs;
                            _.forEach(docs, function (item) {
                                item.id = item._id.toHexString();
                            });
                            return docs;
                        })
                        .then(null, function(error) {
                            console.log(error);
                            throw error;
                        });
                });

                after(function () {
                    return deleteAllTestOrganizations();
                });

                describe("getAll", function () {
                    it("should return all organizations", function () {
                        return request
                            .get('/api/organizations')
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(200)
                            .then(function (result) {
                                result.body.length.should.be.above(0);
                                let org = _.find(result.body, function(item) {
                                    return item.name === existingOrgs[0].name;
                                });
                                org.code.should.equal(existingOrgs[0].code);
                            });
                    });
                });
                describe("getById", function () {
                    it("should return an organization by id", function () {
                        return request
                            .get(`/api/organizations/${existingOrgs[0].id}`)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(200)
                            .then(function (result) {
                                let org = result.body;
                                org.name.should.equal(existingOrgs[0].name);
                                org.code.should.equal(existingOrgs[0].code);
                            });
                    });
                    it("should return a 204 for an id that is not found", function () {
                        let badId = '111111111111111111111111';
                        return request
                            .get(`/api/organizations/${badId}`)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(204);
                    });
                    it("should return a 400 for an id that is not a valid ObjectId", function () {
                        let badId = "thisisabadid";
                        return request
                            .get(`/api/organizations/${badId}`)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(400);
                    });
                });
                describe("create", function () {
                    it("should create a new organization", function () {
                        let newOrg = { name: `${testOrgPrefix}My New Controller Org`, code: `${testOrgPrefix}mynewcontrollerorg`, description: 'Just a test.', statusId: 2, isMetaOrg: false };

                        let relativeUrl = '/api/organizations';
                        return request
                            .post(relativeUrl)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .send(newOrg)
                            .expect(201)
                            .then(function(result) {
                                let org = result.body;
                                org.should.have.property('_id');
                                org.should.have.property('id');
                                org.name.should.equal(newOrg.name);
                                org.code.should.equal(newOrg.code);
                            });
                    });

                    it("should return a 400 for validation error", function () {
                        // code is required
                        let invalidOrg = { name: `${testOrgPrefix}My New Controller Org`, description: 'Just a test.', statusId: 2, isMetaOrg: false };
                        return request
                            .post('/api/organizations')
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .send(invalidOrg)
                            .expect(400);
                        });

                    it("should return a 409 for duplicate key errors", function () {
                        let dupeOrg = { name: `${testOrgPrefix}Dupe Corp`, code: `${testOrgPrefix}acmecorp`, description: 'A cool company.', statusId: 1, isMetaOrg: false };
                        return request
                            .post('/api/organizations')
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .send(dupeOrg)
                            .expect(409);
                    });
                });
                describe("update", function () {
                    it("should update an existing organization", function () {
                        let updatedDescription = 'This is an updated org description';
                        let updatedStatusId = 5;
                        let body = {
                            description: updatedDescription,
                            statusId: updatedStatusId
                        };

                        let relativeUrl = `/api/organizations/${existingOrgs[1].id}`;
                        return request
                            .put(relativeUrl)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .send(body)
                            .expect(200)
                            .then(function(result) {
                                // verify org was updated
                                return request
                                    .get(`/api/organizations/${existingOrgs[1].id}`)
                                    .set('Cookie', [authCookie])
                                    .set('Authorization', authorizationHeaderValue)
                                    .expect(200)
                                    .then((result) => {
                                        let org = result.body;
                                        org.name.should.equal(existingOrgs[1].name);
                                        org.description.should.equal(updatedDescription);
                                        org.statusId.should.equal(updatedStatusId);
                                    });
                            });
                    });
                    it("should return 204 for a non-existent id", function () {
                        let body = {
                            description: 'blah',
                            statusId: 1
                        };
                        let relativeUrl = `/api/organizations/111111111111111111111111`;
                        return request
                            .put(relativeUrl)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .send(body)
                            .expect(204);
                    });
                });
                describe("delete", function () {
                    it("should delete an existing organization", function () {
                        let id = existingOrgs[1].id;
                        return request
                            .delete(`/api/organizations/${id}`)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(204)
                            .then((result) => {
                                // verify org was deleted
                                return request
                                    .get(`/api/organizations/${id}`)
                                    .set('Cookie', [authCookie])
                                    .set('Authorization', authorizationHeaderValue)
                                    .expect(204);
                            });
                    });
                    it("should return 400 for a invalid ObjectId", function () {
                        let relativeUrl = '/api/organizations/123456789012';
                        return request
                            .delete(relativeUrl)
                            .set('Cookie', [authCookie])
                            .set('Authorization', authorizationHeaderValue)
                            .expect(400);
                    });
                    it("should return 204 for a non-existent id", function () {
                        let relativeUrl = '/api/organizations/111111111111111111111111';
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

    function deleteAllTestOrganizations() {
        return database.organizations.remove({name: { $regex: /^00TestOrg00-/ }});
    }
});

