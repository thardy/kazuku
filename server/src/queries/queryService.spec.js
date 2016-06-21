"use strict";

var QueryService = require("./queryService");
var queryTestHelper = require("./queryTestHelper");
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

        before(() => {
            queryService = new QueryService(database);

            return queryTestHelper.setupTestQueries();
        });

        after(() => {
            // Remove all Test documents
            return queryTestHelper.deleteAllTestQueries();
        });

        // todo: alter to enforce orgId (preferably in genericService). Add orgId to all service function parms, have controller pull orgId from auth mechanism.
        it("can get all queries", function () {
            let getAllPromise = queryService.getAll(queryTestHelper.testOrgId);

            return Promise.all([
                getAllPromise.should.eventually.be.instanceOf(Array),
                getAllPromise.should.eventually.have.length.greaterThan(1)
            ]);
        });

        it("can get queries by id", function () {
            let getById = queryService.getById(queryTestHelper.testOrgId, queryTestHelper.existingQuery1.id);

            return getById.should.eventually.deep.equal(queryTestHelper.existingQuery1);
        });

        it("can get all queries that need to be regenerated", function () {
            queryTestHelper.createRegenerateList()
                .then(function (result) {
                    let regeneratePromise = queryService.getRegenerateList(queryTestHelper.testOrgId);

                    return regeneratePromise.should.eventually.deep.equal(queryTestHelper.existingRegenerateList);
                });
        });

        it("can create queries", function () {
            let now = moment().format('hmmss');
            let testName = 'TestTemplate' + now;
            let myTemplate = {
                orgId: queryTestHelper.testOrgId,
                name: testName,
                site: queryTestHelper.testSiteId,
                query: "<h1>newly created template</h1>"
            };

            let createPromise = queryService.create(queryTestHelper.testOrgId, myTemplate);

            return createPromise
                .then((doc) => {
                    return queryService.getById(queryTestHelper.testOrgId, doc.id)
                        .then((retrievedDoc) => {
                            expect(retrievedDoc).to.have.property("site", queryTestHelper.testSiteId);
                            return expect(retrievedDoc).to.have.property("name", testName);
                        });
                });

        });

        it("validates queries on create using extended validation - name and query", function () {
            let invalidQuery = { // just needs to be missing some required properties
                orgId: queryTestHelper.testOrgId,
                siteId: queryTestHelper.testSiteId,
                name: "testQueryName"
                // query property is missing
            };

            let createPromise = queryService.create(queryTestHelper.testOrgId, invalidQuery);

            return createPromise.should.be.rejectedWith(TypeError, "Need name and query");
        });

        it("can update queries by id", function () {
            let updatedQuery = "updatedQuery";
            let theUpdatedQuery = {
                orgId: queryTestHelper.testOrgId,
                name: "testName",
                siteId: queryTestHelper.testSiteId,
                query: updatedQuery
            };

            var updateByIdPromise = queryService.updateById(queryTestHelper.testOrgId, queryTestHelper.existingQuery1.id, theUpdatedQuery);

            return updateByIdPromise.then(function(numAffected) {
                numAffected.should.equal(1);

                // verify query was updated
                var getByIdPromise = queryService.getById(queryTestHelper.testOrgId, queryTestHelper.existingQuery1.id);

                return getByIdPromise.should.eventually.have.property("query").equal(updatedQuery);
            });
        });

        it("can delete queries by id", function () {
            var newQuery = {
                orgId: queryTestHelper.testOrgId,
                siteId: queryTestHelper.testSiteId,
                name: "testQuery",
                query: "<h1>Delete Me</h1>"
            };

            var createPromise = queryService.create(queryTestHelper.testOrgId, newQuery);

            return createPromise.then((doc) => {
                return queryService.delete(queryTestHelper.testOrgId, doc.id).then(function(result) {
                    return queryService.getById(queryTestHelper.testOrgId, doc.id).then(function(retrievedDoc) {
                        return expect(retrievedDoc).to.equal(null);
                    });
                });
            });
        });

    });

    describe("Querying", function () {
        let queryService = {};

        before(() => {
            queryService = new QueryService(database);

            return queryTestHelper.setupTestQueries()
                .then(function (results) {
                    return testHelper.setupTestProducts();
                });
        });

        after(() => {
            // Remove all Test documents
            return queryTestHelper.deleteAllTestQueries()
                .then(function (results) {
                    return testHelper.deleteAllTestProducts();
                });
        });

        it("can resolve queries", function () {
            let expectedResults = [testHelper.newProduct1, testHelper.newProduct3];
            let query = `eq(contentType,${testHelper.testProductsContentType})&lt(price,20)&sort(created)`;
            let resolvePromise = queryService.resolve(testHelper.testOrgId, query);

            return Promise.all([
                resolvePromise.should.eventually.deep.equal(expectedResults)
            ]);
        });
    });

});

