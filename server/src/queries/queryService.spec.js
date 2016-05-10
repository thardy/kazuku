"use strict";

var QueryService = require('./queryService');
var database = require("../database/database");
var Promise = require("bluebird");
var testHelper = require("../common/testHelper");
var _ = require("lodash");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var moment = require("moment");

chai.use(chaiAsPromised);

describe("QueryService", function () {
    describe("CRUD", function () {
        let queryService = {};
        let existingQuery1 = {};
        let existingQuery2= {};
        let existingRegenerateList = [];
        let theUpdatedQuery = {};
        let testOrgId = 1;
        let testSiteId = 1;

        before(() => {
            queryService = new QueryService(database);
            // Insert some docs to be present before all tests start
            // All test data should belong to a specific orgId (a test org)
            var newQuery1 = {
                orgId: testOrgId,
                siteId: testSiteId,
                name: "TestQuery1",
                query: "test query one"
            };
            var newQuery2 = {
                orgId: testOrgId,
                siteId: testSiteId,
                name: "TestQuery2",
                query: "test query two"
            };

            return deleteAllTestTemplates()
                .then((result) => {
                    return database.queries.insert(newQuery1);
                })
                .then((doc) => {
                    existingQuery1 = doc;
                    existingQuery1.id = existingQuery1._id.toHexString();
                    return doc;
                })
                .then((result) => {
                    return database.queries.insert(newQuery2);
                })
                .then((doc) => {
                    existingQuery2 = doc;
                    existingQuery2.id = existingQuery2._id.toHexString();
                    return doc;
                })
                .then(null, (error) => {
                    console.log(error);
                    throw error;
                });
        });

        after(() => {
            // Remove all Test documents
            return deleteAllTestTemplates();
        });

        // todo: alter to enforce orgId (preferably in genericService). Add orgId to all service function parms, have controller pull orgId from auth mechanism.
        it("can get all queries", function () {
            let getAllPromise = queryService.getAll(testOrgId);

            return Promise.all([
                getAllPromise.should.eventually.be.instanceOf(Array),
                getAllPromise.should.eventually.have.length.greaterThan(1)
            ]);
        });

        it("can get queries by id", function () {
            let getById = queryService.getById(testOrgId, existingQuery1.id);

            return getById.should.eventually.deep.equal(existingQuery1);
        });

        it("can get all queries that need to be regenerated", function () {
            createRegenerateList()
                .then(function (result) {
                    let regeneratePromise = queryService.getRegenerateList(testOrgId);

                    return regeneratePromise.should.eventually.deep.equal(existingRegenerateList);
                });
        });

        it("can create queries", function () {
            let now = moment().format('hmmss');
            let testName = 'TestTemplate' + now;
            let myTemplate = {
                orgId: testOrgId,
                name: testName,
                site: testSiteId,
                query: "<h1>newly created template</h1>"
            };

            let createPromise = queryService.create(testOrgId, myTemplate);

            return createPromise
                .then((doc) => {
                    return queryService.getById(testOrgId, doc.id)
                        .then((retrievedDoc) => {
                            expect(retrievedDoc).to.have.property("site", testSiteId);
                            return expect(retrievedDoc).to.have.property("name", testName);
                        });
                });

        });

        it("validates queries on create using extended validation - name and query", function () {
            let invalidQuery = { // just needs to be missing some required properties
                orgId: testOrgId,
                siteId: testSiteId,
                name: "testQueryName"
                // query property is missing
            };

            let createPromise = queryService.create(testOrgId, invalidQuery);

            return createPromise.should.be.rejectedWith(TypeError, "Need name and query");
        });

        it("can update queries by id", function () {
            let updatedQuery = "updatedQuery";
            let theUpdatedQuery = {
                orgId: testOrgId,
                name: "testName",
                siteId: testSiteId,
                query: updatedQuery
            };

            var updateByIdPromise = queryService.updateById(testOrgId, existingQuery1.id, theUpdatedQuery);

            return updateByIdPromise.then(function(numAffected) {
                numAffected.should.equal(1);

                // verify query was updated
                var getByIdPromise = queryService.getById(testOrgId, existingQuery1.id);

                return getByIdPromise.should.eventually.have.property("query").equal(updatedQuery);
            });
        });

        it("can delete queries by id", function () {
            var newQuery = {
                orgId: testOrgId,
                siteId: testSiteId,
                name: "testQuery",
                query: "<h1>Delete Me</h1>"
            };

            var createPromise = queryService.create(testOrgId, newQuery);

            return createPromise.then((doc) => {
                return queryService.delete(testOrgId, doc.id).then(function(result) {
                    return queryService.getById(testOrgId, doc.id).then(function(retrievedDoc) {
                        return expect(retrievedDoc).to.equal(null);
                    });
                });
            });
        });

        function deleteAllTestTemplates() {
            return database.queries.remove({orgId: testOrgId});
        }

        function createRegenerateList() {
            existingRegenerateList = [
                { orgId: testOrgId, siteId: testSiteId, name: "QueryToRegenerate1", query: "plz regenerate this query", regenerate: 1 },
                { orgId: testOrgId, siteId: testSiteId, name: "QueryToRegenerate2", query: "query needz regenerating", regenerate: 1 },
                { orgId: testOrgId, siteId: testSiteId, name: "QueryToRegenerate3", query: "query regen ftw", regenerate: 1 }
            ];

            return database.templates.insert(existingRegenerateList)
                .then(function (result) {
                    // throw in one that should not be regenerated, and actually has a regenerate property with a value of 0
                    return database.templates.insert({ orgId: testOrgId, siteId: testSiteId, name: "QueryToNOTRegenerate1", query: "do not regenerate me", regenerate: 0 });
                });
        }
    });

});

