'use strict';
import CustomDataService from './customDataService.js';
import Promise from 'bluebird';
import {database} from '../database/database.js';
import pureMongoService from '../database/pureMongoService.js';
import _ from 'lodash';
import chai from 'chai';
const should = chai.Should();
const expect = chai.expect;
import moment from 'moment';
// var Query = require("rql/query").Query;
import testHelper from '../common/testHelper.js';

import gql from 'graphql-tag';
import SchemaService from '../server/graphQL/schemaService.js';
import CustomApolloServer from '../server/graphQL/customApolloServer.js';
import apolloServerExpress from 'apollo-server-express';
const {makeExecutableSchema} = apolloServerExpress;
import apolloServerTesting from 'apollo-server-testing';
const {createTestClient} = apolloServerTesting;


//temp
import mongoRql from 'mongo-rql';

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import chaiThings from 'chai-things';
chai.use(chaiThings);

let testOrgId = testHelper.testOrgId;

const GET_ALL_TEST_PRODUCTS = gql`
  query {
    testProducts {
      _id,
      name,
      description,
      price,
      quantity
    }
  }
`;

describe("CustomDataService", function () {
    describe("CRUD", function () {
        let customDataService = {};
        let existingCustomData1 = {};
        let existingCustomData2 = {};
        let theUpdatedCustomData = {};
        let testContentType = 'testType';
        let query = {};
        let mutate = {};

        before(async () => {
            customDataService = new CustomDataService(database);

            // Insert some docs to be present before all tests start
            return testHelper.deleteAllCustomDataForTestOrg()
                .then((result) => {
                    return testHelper.setupTestProducts();
                })
                .then((result) => {
                    return testHelper.setupDifferentTestProducts();
                });
        });

        // before(function () {
        //     customDataService = new CustomDataService(database);
        //     // Insert some docs to be present before all tests start
        //     // All test data should belong to a specific orgId (a test org)
        //     var newCustomData1 = { orgId: testOrgId, contentType: testContentType, title: 'My First Blog Post', template: 'Imagine a well written blog here.'};
        //     var newCustomData2 = { orgId: testOrgId, contentType: testContentType, title: 'A Dog Ate My Homework', template: 'It was a dark and rainy night...'};
        //
        //     return deleteAllTestData()
        //         .then(function(result) {
        //             return database.customData.insert(newCustomData1);
        //         })
        //         .then(function(doc) {
        //             existingCustomData1 = doc;
        //             existingCustomData1.id = existingCustomData1._id.toHexString();
        //             return doc;
        //         })
        //         .then(function(result) {
        //             return database.customData.insert(newCustomData2);
        //         })
        //         .then(function(doc) {
        //             existingCustomData2 = doc;
        //             existingCustomData2.id = existingCustomData2._id.toHexString();
        //             return doc;
        //         })
        //         .catch(error => {
        //             console.log(error);
        //             throw error;
        //         });
        // });

        after(function () {
            // Remove all Test documents
            return deleteAllTestData()
                .then((result) => {
                    return testHelper.deleteAllDifferentTestProducts();
                });
        });

        it("can get all data for an org", () => {
            var getByContentTypePromise = customDataService.getAll(testOrgId);

            return Promise.all([
                getByContentTypePromise.should.eventually.be.instanceOf(Array),
                getByContentTypePromise.should.eventually.have.length(5)
            ]);
        });

        it("can create customData of a specified ContentType", function () {
            var now = moment().format('MMMM Do YYYY, h:mm:ss a');
            var testBlogContent = 'Test blog post here. ' + now;
            var customData = { orgId: testOrgId, contentType: testContentType, title: 'New Test Blog Post', template: testBlogContent };

            var createPromise = customDataService.create(testOrgId, customData);

            return Promise.all([
                createPromise.should.eventually.be.an("object"),
                createPromise.should.eventually.have.property("template", testBlogContent)
            ]);
        });

        it("validates customData on create using extended validation - contentType", function () {
            var invalidCustomData = { orgId: testOrgId, title: 'New Test Blog Post2', template: 'content of invalid customData object' };

            var createPromise = customDataService.create(testOrgId, invalidCustomData);

            return createPromise.should.be.rejectedWith(TypeError, "Need contentType");
        });

        it("can get all data of a specified ContentType", function () {
            var getByContentTypePromise = customDataService.getByContentType(testOrgId, testHelper.testProductsContentType);

            return Promise.all([
                getByContentTypePromise.should.eventually.be.instanceOf(Array),
                getByContentTypePromise.should.eventually.have.length(3)
            ]);
        });

        it("can get customData by contentType and Id", function () {
            var getByTypeAndId = customDataService.getByTypeAndId(testOrgId, testHelper.existingProducts[0].contentType, testHelper.existingProducts[0].id);

            return getByTypeAndId.should.eventually.have.property("name", testHelper.existingProducts[0].name);
        });

        it("can update customData by id", function () {
            var newDescription = '#New Test Description';
            theUpdatedCustomData = { description: newDescription };

            var updateByIdPromise = customDataService.updateById(testOrgId, testHelper.existingProducts[1].id, theUpdatedCustomData);

            return updateByIdPromise.then(function(result) {
                result.nModified.should.equal(1);

                // verify customData was updated
                var getByIdPromise = customDataService.getById(testOrgId, testHelper.existingProducts[1].id);

                return getByIdPromise.should.eventually.have.property("description", newDescription);
            });
        });

        it("can delete customData by id", function () {
            var newCustomData = { orgId: testOrgId, contentType: testContentType, title: 'Some title here', template: 'this customData is to be deleted'};
            var createPromise = customDataService.create(testOrgId, newCustomData);

            return createPromise
                .then(function(doc) {
                    var id = doc.id;
                    return customDataService.delete(testOrgId, doc.id)
                        .then(function(result) {
                            return customDataService.getById(testOrgId, id)
                                .then(function(retrievedDoc) {
                                    return expect(retrievedDoc).to.equal(null);
                                });
                        });
                });
        });

        it("can audit for create", function () {
            const customData = { orgId: testOrgId, contentType: testContentType, title: 'Testing audit for create', template: 'some content' };
            const PARSE_FORMAT = 'MM-DD-YYYY hh:mm:ss';
            const now = moment().utc();
            const thirtySecondsFromNow = moment().utc().add(30, 'seconds');
            const createPromise = customDataService.create(testOrgId, customData);

            return createPromise
                .then((doc) => {
                    const created = moment.utc(doc.created, PARSE_FORMAT);
                    const withinExpectedTimeframe = created.isBefore(thirtySecondsFromNow) && created.isSameOrAfter(now, 'second'); // had to specify the precision to get isSameOrAfter to work
                    expect(withinExpectedTimeframe).to.equal(true);
                    return expect(doc.createdBy).to.equal(testHelper.testUserEmail);
                });

            // Promise.all([
            //     createPromise.should.eventually.be.an("object"),
            //     createPromise.should.eventually.have.property("created", testBlogContent),
            //     createPromise.should.eventually.have.property("createdBy", testBlogContent)
            // ]);
        });

        function deleteAllTestData() {
            return database.customData.remove({orgId: testHelper.testOrgId, contentType: testContentType});
        }

        describe("CRUD with dates", function () {
            it("create converts ISO8601 date strings to Mongo dates", function() {
                var dateString = '2014-02-27T10:00:00';
                var expectedDate = new Date('2014-02-27T10:00:00');
                var objectWithIsoDateString = { orgId: testOrgId, contentType: testContentType, title: 'Some title here', someDate: dateString};

                var createPromise = customDataService.create(testOrgId, objectWithIsoDateString);

                return createPromise.should.eventually.have.property("someDate").deep.equal(expectedDate);
            });
            it("updateById converts ISO8601 date strings to Mongo dates", function () {
                var dateString = '2016-01-27T08:43:00';
                var expectedDate = new Date('2016-01-27T08:43:00');
                var theUpdatedCustomData = { favoriteDate: dateString };

                var updateByIdPromise = customDataService.updateById(testOrgId, testHelper.existingProducts[2].id, theUpdatedCustomData);

                return updateByIdPromise.then(function(result) {
                    result.nModified.should.equal(1);

                    // verify customData was updated
                    var getByIdPromise = customDataService.getById(testOrgId, testHelper.existingProducts[2].id);

                    getByIdPromise.should.eventually.have.property("favoriteDate").deep.equal(expectedDate);
                });
            });
        });
    });

    describe("GraphQL", () => {
        let customDataService = {};
        let schemaService = {};
        let existingProducts = [];
        let testContentType = 'testProducts';
        let now = moment().format('MMMM Do YYYY, h:mm:ss a');
        // todo: remove these.  use the testHelper.
        // todo: figure out the whole date_released/dateReleased thing.  What is going on there?
        let newProduct1 = { orgId: testOrgId, contentType: testContentType, name: 'Widget', description: 'It is a widget.', price: 9.99, quantity: 1000, date_released: new Date('2014-01-01T00:00:00') };
        let newProduct2 = { orgId: testOrgId, contentType: testContentType, name: 'Log', description: 'Such a wonderful toy! It\'s fun for a girl or a boy.', price: 99.99, quantity: 20, date_released: new Date('2015-05-20T00:00:00') };
        let newProduct3 = { orgId: testOrgId, contentType: testContentType, name: 'Doohicky', description: 'Like a widget, only better.', price: 19.99, quantity: 85, date_released: new Date('2015-01-27T00:00:00')  };
        let testApolloServer = {};
        let apolloTestClient = {};

        before(async () => {
            customDataService = new CustomDataService(database);
            schemaService = new SchemaService(database);

            await pureMongoService.connectDb();
            const db = pureMongoService.db;

            await testHelper.setupSchemasForQueryTests();

            const createApolloServer = async () => {
                const customSchema = await schemaService.getSchemaByRepoCode('');

                const server = new CustomApolloServer({
                    //schema: makeExecutableSchema({ typeDefs, resolvers })
                    schema: customSchema,
                    context: {
                        db: db,
                    },
                });

                return server;
            };

            testApolloServer = await createApolloServer();
            apolloTestClient = createTestClient(testApolloServer);

            // Insert some docs to be present before all tests start
            return Promise.all([
                testHelper.setupTestProducts(),
            ]);
        });

        after(function () {
            // Remove all Test documents
            // return deleteAllTestData();
            return Promise.all([
                testHelper.deleteAllTestSchemas(),
                testHelper.deleteAllTestProducts(),
            ])
        });

        function deleteAllTestData() {
            return database.customData.remove({orgId: testOrgId, contentType: testContentType});
        }

        it("can query GraphQL", async () => {
            // my first attempt at using GraphQL in my tests - I just want to make sure I can call the apollo server with a query
            const result = await apolloTestClient.query({
                query: GET_ALL_TEST_PRODUCTS
            });

            // this is returning an empty array
            expect(result.data.testProducts).to.be.instanceOf(Array);
            expect(result.data.testProducts).to.have.length(3);
        });

        // this is old, back when I was using RQL.  Determine if there's anything of value here then delete.
//        it("can start my own query parsing experiment", function () {
//            let expectedResults = [newProduct1, newProduct3];
//            let queryString = `eq(contentType, ${testContentType})&limit(2)&sort(created)`;
//            let queryArray = queryString.split("&");
//
//            let query = new Query();
//            for (var segment of queryArray) {
//                let operatorRegex = /^.*(?=(\())/;
//                let matchArray = operatorRegex.exec(segment);
//                let operator = matchArray[0];
//                let operandsRegex = /\(([^)]+)\)/;
//                let operandsMatchArray = operandsRegex.exec(segment);
//                let operandsString = operandsMatchArray[1];
//                let operandsArray = operandsString.split(",");
//                let operand1 = operandsArray[0].trim();
//                let operand2 = operandsArray.length > 1 ? operandsArray[1].trim() : null;
//
//                switch (operator) {
//                    case "eq":
//                        query = query.eq(operand1, operand2);
//                        break;
//                    case "limit":
//                        query = query.limit(operand1);
//                        break;
//                    case "sort":
//                        query = query.sort(operand1);
//                        break;
//                }
//            }
//
//            let findPromise = customDataService.find(testOrgId, query);
//
//            return findPromise.should.eventually.deep.equal(expectedResults);
//
//        });

        it("can filter using pagination limit", async () => {
            const limit = 2;
            const query = gql`
              query {
                testProducts(
                  sort: { dateReleased: DESC }
                  pagination: { limit: ${limit} }
                ) {
                  _id, name, description, price, quantity, dateReleased
                }
              }
            `;

            const result = await apolloTestClient.query({
                query: query
            });

            expect(result.data.testProducts).to.have.length(limit);
        });

        it("can filter float fields", async () => {
            const query = gql`
              query {
                testProducts(
                  filter: { 
                    price: { GT: 10.00 },
                    quantity: { GT: 50 } 
                  }
                ) {
                  _id, name, description, price, quantity, dateReleased
                }
              }
            `;

            const result = await apolloTestClient.query({
                query: query
            });

            expect(result.data.testProducts).to.have.length(1);
            const firstProduct = result.data.testProducts[0];
            expect(firstProduct.name).to.equal('Doohicky');
        });

        // it("can query using an RQL string in method format", function () {
        //     let expectedResults = [testHelper.newProduct1, testHelper.newProduct3];
        //     let query = `eq(contentType,${testContentType})&sort(created)&limit(2,0)`; // limit must come last or it won't work
        //
        //     let findPromise = customDataService.find(testOrgId, query);
        //
        //     return findPromise.should.eventually.deep.equal(expectedResults);
        // });
        //
        // it("can query using an RQL string", function () {
        //     var findPromise = customDataService.find(testOrgId, 'contentType=testProducts&price=gt=10.5&quantity=lt=50');
        //     //var findPromise = customDataService.find('name=Widget');
        //
        //     return Promise.all([
        //         findPromise.should.eventually.be.instanceOf(Array),
        //         findPromise.should.eventually.have.length(1),
        //         findPromise.should.eventually.have.deep.property('[0].name', newProduct2.name)
        //     ]);
        // });

        it("can filter dates", async () => {
            const dateFilter = '2015-05-10T00:00:00Z';
            const query = gql`
              query {
                testProducts(
                  filter: { 
                    dateReleased: { LTE: "${dateFilter}" },
                  }
                ) {
                  _id, name, description, price, quantity, dateReleased
                }
              }
            `;

            const result = await apolloTestClient.query({
                query: query
            });

            expect(result.data.testProducts).to.be.instanceOf(Array);
            expect(result.data.testProducts).to.have.length(2);
        });

        // I found where they added the REGEX filter to graphql-to-mongodb - https://github.com/Soluto/graphql-to-mongodb/commit/52d91618514ab28d4280b23b10a26105a3f0c817
        it("can query strings using regex filter", async () => {
            const regexPattern = 'toy';
            const query = `
              query {
                testProducts(
                  filter: { 
                    description: { REGEX: "${regexPattern}", OPTIONS: "i" }
                  }
                ) {
                  _id, name, description, price, quantity, dateReleased
                }
              }
            `;

            const result = await apolloTestClient.query({
                query: query
            });

            expect(result.data.testProducts).to.be.instanceOf(Array);
            expect(result.data.testProducts).to.have.length(1);
            expect(result.data.testProducts[0].name).to.equal(newProduct2.name);
        });

        it("can query custom number fields by value", async () => {
            const quantity = newProduct3.quantity; // make sure newProduct3 always has a unique quantity in the test data
            const query = gql`
              query {
                testProducts(
                  filter: { 
                    quantity: { EQ: ${quantity} },
                  }
                ) {
                  _id, name, description, price, quantity, dateReleased
                }
              }
            `;

            const result = await apolloTestClient.query({
                query: query
            });

            expect(result.data.testProducts).to.be.instanceOf(Array);
            expect(result.data.testProducts).to.have.length(1);
            expect(result.data.testProducts[0].name).to.equal(newProduct3.name);
        });
        it("can query custom number fields greater than value", async () => {
            const quantity = 90;
            const query = gql`
              query {
                testProducts(
                  filter: { 
                    quantity: { GT: ${quantity} },
                  }
                ) {
                  _id, name, description, price, quantity, dateReleased
                }
              }
            `;

            const result = await apolloTestClient.query({
                query: query
            });

            expect(result.data.testProducts).to.be.instanceOf(Array);
            expect(result.data.testProducts).to.have.length(1);
            expect(result.data.testProducts[0].name).to.equal(newProduct1.name);
        });
        it("can query custom number fields in range", async () => {
            const lowRange = 5.00;
            const highRange = 20.00;
            const query = gql`
              query {
                testProducts(
                  filter: { 
                    price: { GTE: ${lowRange}, LTE: ${highRange} },
                  },
                  sort: { created: ASC }
                ) {
                  _id, name, description, price, quantity, dateReleased
                }
              }
            `;

            const result = await apolloTestClient.query({
                query: query
            });

            expect(result.data.testProducts).to.be.instanceOf(Array);
            expect(result.data.testProducts).to.have.length(2);
            expect(result.data.testProducts[0].name).to.equal(newProduct1.name);
            expect(result.data.testProducts[1].name).to.equal(newProduct3.name);
        });

        it("can query custom date fields by value", async () => {
            const findDate = moment(newProduct2.date_released).toISOString(); //'2015-06-10T00:00:00Z';
            const query = gql`
              query {
                testProducts(
                  filter: { 
                    dateReleased: { EQ: "${findDate}" },
                  }
                ) {
                  _id, name, description, price, quantity, dateReleased
                }
              }
            `;

            const result = await apolloTestClient.query({
                query: query
            });

            expect(result.data.testProducts).to.be.instanceOf(Array);
            expect(result.data.testProducts).to.have.length(1);
            expect(result.data.testProducts[0].name).to.equal(newProduct2.name);
        });
        it("can query custom date fields greater than value", async () => {
            // todo: Fix stupid lazy date, format that won't allow '2015-01-01' -> Expected type DateTime, found "2015-01-01"; DateTime cannot represent an invalid date-time-string 2015-01-01.
            const lowRange = '2015-01-01';
            // const lowRange = '2015-01-01T00:00:00Z';
            const query = gql`
              query {
                testProducts(
                  filter: { 
                    dateReleased: { GT: "${lowRange}" },
                  },
                  sort: { dateReleased: DESC }
                ) {
                  _id, name, description, price, quantity, dateReleased
                }
              }
            `;

            const result = await apolloTestClient.query({
                query: query
            });

            expect(result.data.testProducts).to.be.instanceOf(Array);
            expect(result.data.testProducts).to.have.length(2);
            expect(result.data.testProducts[0].name).to.equal(newProduct2.name);
            expect(result.data.testProducts[1].name).to.equal(newProduct3.name);
        });
        it("can query custom date fields within range", async () => {
            const startDate = '2015-01-27';
            // todo: this is currently failing - it succeeds if I add one day.  The LTE (less than or equal to) is not working as it should.
            const endDate = '2015-05-20';
            const query = gql`
              query {
                testProducts(
                  filter: { 
                    dateReleased: { GTE: "${startDate}", LTE: "${endDate}" },
                  },
                  sort: { dateReleased: DESC }
                ) {
                  _id, name, description, price, quantity, dateReleased
                }
              }
            `;

            const result = await apolloTestClient.query({
                query: query
            });

            expect(result.data.testProducts).to.be.instanceOf(Array);
            expect(result.data.testProducts).to.have.length(2);
            expect(result.data.testProducts[0].name).to.equal(newProduct2.name);
            expect(result.data.testProducts[1].name).to.equal(newProduct3.name);
        });

        // todo: add timezone tests
    });


});
