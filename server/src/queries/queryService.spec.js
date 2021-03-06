'use strict';

import QueryService from './queryService.js';
import queryTestHelper from './queryTestHelper.js';
import {database} from '../database/database.js';
import Promise from 'bluebird';
import testHelper from '../common/testHelper.js';
import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
const should = chai.Should();
const expect = chai.expect;
import moment from 'moment';

// temporary
import CustomDataService from '../customData/customDataService.js';

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
            return queryTestHelper.createRegenerateList()
                .then(function (result) {
                    let regeneratePromise = queryService.getRegenerateList(queryTestHelper.testOrgId);

                    return regeneratePromise.should.eventually.deep.include.members(queryTestHelper.existingRegenerateList);
                });
        });

        it("can create queries", function () {
            let now = moment().format('hmmss');
            let testName = 'TestQuery' + now;
            let myQuery = {
                orgId: queryTestHelper.testOrgId,
                name: testName,
                nameId: 'test-query',
                query: `eq(contentType,fake-content-type)&sort(created)&limit(2,0)`
            };

            let createPromise = queryService.create(queryTestHelper.testOrgId, myQuery);

            return createPromise
                .then((doc) => {
                    return queryService.getById(queryTestHelper.testOrgId, doc.id)
                        .then((retrievedDoc) => {
                            expect(retrievedDoc).to.have.property("name", testName);
                            return expect(retrievedDoc).to.have.property("query", myQuery.query);
                        });
                });

        });

        it("validates queries on create using extended validation - name and query", function () {
            let invalidQuery = { // just needs to be missing some required properties
                orgId: queryTestHelper.testOrgId,
                siteId: queryTestHelper.testSiteId,
                name: "testQueryName",
                nameId: 'test-query-name'
                // query property is missing
            };

            let createPromise = queryService.create(queryTestHelper.testOrgId, invalidQuery);

            return createPromise.should.be.rejectedWith(TypeError, "Need name, nameId, and query");
        });

        it("can update queries by id", function () {
            let updatedQuery = "updatedQuery";
            let theUpdatedQuery = {
                orgId: queryTestHelper.testOrgId,
                name: "testName",
                nameId: 'test-name',
                siteId: queryTestHelper.testSiteId,
                query: updatedQuery
            };

            var updateByIdPromise = queryService.updateById(queryTestHelper.testOrgId, queryTestHelper.existingQuery1.id, theUpdatedQuery);

            return updateByIdPromise.then(function(result) {
                result.nModified.should.equal(1);

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
                nameId: 'test-query',
                query: "<h1>Delete Me</h1>"
            };

            var createPromise = queryService.create(queryTestHelper.testOrgId, newQuery);

            let createdQuery = null;
            return createPromise
                .then((doc) => {
                    createdQuery = doc;
                    return queryService.delete(queryTestHelper.testOrgId, createdQuery.id)
                })
                .then(function(result) {
                    return queryService.getById(queryTestHelper.testOrgId, createdQuery.id)
                })
                .then(function(retrievedDoc) {
                    return expect(retrievedDoc).to.equal(null);
                });
        });

        it("getAllDependentsOfItem with data item returns item array of dependent queries", function () {
            let item = {type: "data", nameId: queryTestHelper.testQueryDataContentType};
            let expectedDependents = [
                {type: "query", nameId: "dataquery_one"},
                {type: "query", nameId: "dataquery_two"},
                {type: "query", nameId: "dataquery_three"},
            ];

            return queryTestHelper.createExistingDataQueries()
                .then(() => {
                    return queryService.getAllDependentsOfItem(queryTestHelper.testOrgId, item);
                })
                .then((allDependents) => {
                    // Chai: this is how to test unordered array equivalency (objects are never equal in javascript)
                    //  https://medium.com/building-ibotta/testing-arrays-and-objects-with-chai-js-4b372310fe6d
                    //  - deep compares object equivalency
                    //  - have and members compares unordered array equality
                    return expect(allDependents).to.have.deep.members(expectedDependents);
                });
        });

        it("can save dependencies on create", function () {
            let myQuery = {
                orgId: queryTestHelper.testOrgId,
                name: "TestQueryWithDependencies",
                nameId: 'test-query-with-dependencies',
                query: `eq(contentType,${queryTestHelper.testQueryDataContentType})&sort(created)&limit(2,0)`
            };
            let expectedDependencies = [
                {type: "data", nameId: queryTestHelper.testQueryDataContentType},
            ];

            let createPromise = queryService.create(queryTestHelper.testOrgId, myQuery);

            return createPromise
                .then((doc) => {
                    return queryService.getById(queryTestHelper.testOrgId, doc.id)
                        .then((retrievedDoc) => {
                            retrievedDoc.name.should.equal(myQuery.name);
                            retrievedDoc.query.should.equal(myQuery.query);
                            return retrievedDoc.dependencies.should.deep.include.members(expectedDependencies);
                        });
                });
        });

        it("can save dependencies on update", function () {
            let theUpdatedQuery = {
                orgId: queryTestHelper.testOrgId,
                name: "testName",
                nameId: 'test-name',
                siteId: queryTestHelper.testSiteId,
                query: `eq(contentType,some-content-type)&sort(created)&limit(2,0)`
            };
            let expectedDependencies = [
                {type: "data", nameId: "some-content-type"},
            ];

            var updateByIdPromise = queryService.updateById(queryTestHelper.testOrgId, queryTestHelper.existingQuery1.id, theUpdatedQuery);

            return updateByIdPromise
                .then((result) => {
                    result.nModified.should.equal(1);

                    // verify dependencies value
                    var getByIdPromise = queryService.getById(queryTestHelper.testOrgId, queryTestHelper.existingQuery1.id);

                    return getByIdPromise.should.eventually.have.property("dependencies").deep.equal(expectedDependencies);
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
                })
                .then((results) => {
                    return queryTestHelper.createExistingDataQueries();
                })
                .then((results) => {
                    return queryTestHelper.createExistingQueryData();
                });
        });

        after(() => {
            // Remove all Test documents
            return queryTestHelper.deleteAllTestQueries()
                .then(function (results) {
                    return testHelper.deleteAllTestProducts();
                })
                .then((results) => {
                    return queryTestHelper.deleteAllQueryData();
                });
        });

        it("can resolve queries", function () {
            let expectedResults = [testHelper.newProduct1, testHelper.newProduct3];
            let query = `eq(contentType,${testHelper.testProductsContentType})&lt(price,20)&sort(created)`;
            let resolvePromise = queryService.resolve(testHelper.testOrgId, query);

            return Promise.all([
                resolvePromise.should.eventually.deep.include.members(expectedResults)
            ]);
        });

        it("can resolve all query properties on model object", function () {
            let model = {
                propertyOne: "query(dataquery_one)",
                propertyTwo: "query(dataquery_two)",
                propertyThree: "someString",
                propertyFour: "query(dataquery_three)"
            };
            let expected = {
                propertyOne: [
                    queryTestHelper.existingQueryData[0],
                    queryTestHelper.existingQueryData[1]
                ],
                propertyTwo: [
                    queryTestHelper.existingQueryData[3],
                    queryTestHelper.existingQueryData[2],
                    queryTestHelper.existingQueryData[1]
                ],
                propertyThree: "someString",
                propertyFour: [
                    queryTestHelper.existingQueryData[1],
                    queryTestHelper.existingQueryData[2]
                ]
            };

            let resolvePromise = queryService.resolveQueryPropertiesOnModel(queryTestHelper.testOrgId, model);

            return resolvePromise
                .then((result) => {
                    expect(model).to.deep.equal(expected);
                });

        });

        it("random customData query test using date", function () {
            let customDataService = new CustomDataService(database);
            let findPromise = customDataService.find(queryTestHelper.testOrgId, "eq(contentType,test_query_data_content_type)&ge(created,date:2016-02-20)&sort(created)&limit(2,0)");
            let expected = [
                queryTestHelper.existingQueryData[1],
                queryTestHelper.existingQueryData[2]
            ];

            return findPromise
                .then((result) => {
                    expect(result).to.deep.equal(expected);
                });
        });
    });

    describe("Dependencies", function() {
        let queryService = {};

        before(() => {
            queryService = new QueryService(database);
        });

        after(() => {});

        describe("getDependenciesOfQuery", function () {
            it("should return all dependencies of a query", function () {
                let expectedDependencies = [{type: "data", nameId: "products"}];
                let query = {
                    orgId: queryTestHelper.testOrgId,
                    siteId: 1,
                    name: "top5Products",
                    nameId: 'top_5_products',
                    query: "eq(contentType,products)&sort(created)&limit(5,0)"
                };

                let dependencies = queryService.getDependenciesOfQuery(query.query);

                dependencies.should.have.length(1);
                dependencies.should.deep.equal(expectedDependencies);
            });
        });
    });
});

