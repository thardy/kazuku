const _ = require("lodash");
const express = require("express");
const app = require('../server');
const request = require("supertest-as-promised")
const chai = require("chai");
const should = chai.Should();
const expect = chai.expect;
const moment = require("moment");
const database = require("../database/database").database;

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

describe("ApiTests", function () {
    describe("organizationsController", function () {

        describe("when authorized", function () {
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
                        return request(app)
                            .get('/api/organizations')
                            .expect(200)
                            .then(function (result) {
                                result.body.length.should.equal(existingOrgs.length);
                                let org = _.find(result.body, function(item) {
                                    return item.name === existingOrgs[0].name;
                                });
                                org.code.should.equal(existingOrgs[0].code);
                            });
                    });
                });
                describe("getById", function () {
                    it("should return an organization by id", function () {
                        return request(app)
                            .get(`/api/organizations/${existingOrgs[0].id}`)
                            .expect(200)
                            .then(function (result) {
                                let org = result.body;
                                org.name.should.equal(existingOrgs[0].name);
                                org.code.should.equal(existingOrgs[0].code);
                            });
                    });
                    it("should return a 404 for an id that is not found", function () {
                        let badId = '111111111111111111111111';
                        return request(app)
                            .get(`/api/organizations/${badId}`)
                            .expect(404);
                    });
                    it("should return a 400 for an id that is not a valid ObjectId", function () {
                        let badId = "thisisabadid";
                        return request(app)
                            .get(`/api/organizations/${badId}`)
                            .expect(400);
                    });
                });
                describe("create", function () {
                    it("should create a new organization", function () {
                        let newOrg = { name: `${testOrgPrefix}My New Controller Org`, code: `${testOrgPrefix}mynewcontrollerorg`, description: 'Just a test.', statusId: 2, isMetaOrg: false };

                        let relativeUrl = '/api/organizations';
                        return request(app)
                            .post(relativeUrl)
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
                       return request(app)
                           .post('/api/organizations')
                           .send(invalidOrg)
                           .expect(400);
                    });

                    it("should return a 409 for duplicate key errors", function () {
                        let dupeOrg = { name: `${testOrgPrefix}Dupe Corp`, code: `${testOrgPrefix}acmecorp`, description: 'A cool company.', statusId: 1, isMetaOrg: false };
                        return request(app)
                           .post('/api/organizations')
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
                        return request(app)
                            .put(relativeUrl)
                            .send(body)
                            .expect(200)
                            .then(function(result) {
                                // verify org was updated
                                return request(app)
                                    .get(`/api/organizations/${existingOrgs[1].id}`)
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
                        return request(app)
                            .put(relativeUrl)
                            .send(body)
                            .expect(404);
                    });
                });
                describe("delete", function () {
                    it("should delete an existing organization", function () {
                        let id = existingOrgs[1].id;
                        return request(app)
                            .delete(`/api/organizations/${id}`)
                            .expect(204)
                            .then((result) => {
                                // verify org was deleted
                                return request(app)
                                    .get(`/api/organizations/${id}`)
                                    .expect(404);
                            });
                    });
                    it("should return 400 for a invalid ObjectId", function () {
                        let relativeUrl = '/api/organizations/123456789012';
                        return request(app)
                            .delete(relativeUrl)
                            .expect(400);
                    });
                    it("should return 404 for a non-existent id", function () {
                        let relativeUrl = '/api/organizations/111111111111111111111111';
                        return request(app)
                            .delete(relativeUrl)
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

