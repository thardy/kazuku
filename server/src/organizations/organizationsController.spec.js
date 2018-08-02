const _ = require("lodash");
const config = require('../server/config');
const app = require('../server');
const request = require('supertest')(`http://${config.hostname}:${config.port}`);
const chai = require("chai");
const should = chai.Should();
const expect = chai.expect;
const moment = require("moment");
const database = require("../database/database").database;

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

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

            before(function () {
                return request
                    .post('/api/users/login')
                    .send({
                        email: 'admin',
                        password: 'test'
                    })
                    .expect(200)
                    .then(response => {
                        // todo: look for the auth cookie
                        const cookies = response.header['set-cookie'];
                        if (cookies && cookies.length > 0) {
                            authCookie = cookies[0]
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
                            .expect(200)
                            .then(function (result) {
                                let org = result.body;
                                org.name.should.equal(existingOrgs[0].name);
                                org.code.should.equal(existingOrgs[0].code);
                            });
                    });
                    it("should return a 404 for an id that is not found", function () {
                        let badId = '111111111111111111111111';
                        return request
                            .get(`/api/organizations/${badId}`)
                            .set('Cookie', [authCookie])
                            .expect(404);
                    });
                    it("should return a 400 for an id that is not a valid ObjectId", function () {
                        let badId = "thisisabadid";
                        return request
                            .get(`/api/organizations/${badId}`)
                            .set('Cookie', [authCookie])
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
                           .send(invalidOrg)
                           .expect(400);
                    });

                    it("should return a 409 for duplicate key errors", function () {
                        let dupeOrg = { name: `${testOrgPrefix}Dupe Corp`, code: `${testOrgPrefix}acmecorp`, description: 'A cool company.', statusId: 1, isMetaOrg: false };
                        return request
                           .post('/api/organizations')
                            .set('Cookie', [authCookie])
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
                            .send(body)
                            .expect(200)
                            .then(function(result) {
                                // verify org was updated
                                return request
                                    .get(`/api/organizations/${existingOrgs[1].id}`)
                                    .set('Cookie', [authCookie])
                                    .expect(200)
                                    .then((result) => {
                                        let org = result.body;
                                        org.name.should.equal(existingOrgs[1].name);
                                        org.description.should.equal(updatedDescription);
                                        org.statusId.should.equal(updatedStatusId);
                                    });
                            });
                    });
                    it("should return 404 for a non-existent id", function () {
                        let body = {
                            description: 'blah',
                            statusId: 1
                        };
                        let relativeUrl = `/api/organizations/111111111111111111111111`;
                        return request
                            .put(relativeUrl)
                            .set('Cookie', [authCookie])
                            .send(body)
                            .expect(404);
                    });
                });
                describe("delete", function () {
                    it("should delete an existing organization", function () {
                        let id = existingOrgs[1].id;
                        return request
                            .delete(`/api/organizations/${id}`)
                            .set('Cookie', [authCookie])
                            .expect(204)
                            .then((result) => {
                                // verify org was deleted
                                return request
                                    .get(`/api/organizations/${id}`)
                                    .set('Cookie', [authCookie])
                                    .expect(404);
                            });
                    });
                    it("should return 400 for a invalid ObjectId", function () {
                        let relativeUrl = '/api/organizations/123456789012';
                        return request
                            .delete(relativeUrl)
                            .set('Cookie', [authCookie])
                            .expect(400);
                    });
                    it("should return 404 for a non-existent id", function () {
                        let relativeUrl = '/api/organizations/111111111111111111111111';
                        return request
                            .delete(relativeUrl)
                            .set('Cookie', [authCookie])
                            .expect(404);
                    });
                });
            });


        });
    });

    function deleteAllTestOrganizations() {
        return database.organizations.remove({name: { $regex: /^00TestOrg00-/ }});
    }
});

