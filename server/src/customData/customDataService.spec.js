"use strict";
var CustomDataService = require("./customDataService");
var Promise = require("bluebird");
var database = require("../database/database").database;
var _ = require("lodash");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;
var moment = require("moment");
var Query = require("rql/query").Query;
const testHelper = require("../common/testHelper");

//temp
var mongoRql = require('mongo-rql');

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

let testOrgId = testHelper.testOrgId;

describe("CustomDataService", function () {
    describe("CRUD", function () {
        var customDataService = {};
        var existingCustomData1 = {};
        var existingCustomData2 = {};
        var theUpdatedCustomData = {};
        var testContentType = 'testType';

        before(function () {
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

        it("can get all data for an org", function () {
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
                    return expect(doc.createdBy).to.equal(testHelper.testUserId);
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

    describe("Resource Query Language", function () {
        var customDataService = {};
        var existingProducts = [];
        var testContentType = 'testProducts';
        var now = moment().format('MMMM Do YYYY, h:mm:ss a');
        var newProduct1 = { orgId: testOrgId, contentType: testContentType, name: 'Widget', description: 'It is a widget.', price: 9.99, quantity: 1000, created: new Date('2014-01-01T00:00:00') };
        var newProduct2 = { orgId: testOrgId, contentType: testContentType, name: 'Log', description: 'Such a wonderful toy! It\'s fun for a girl or a boy.', price: 99.99, quantity: 20, created: new Date('2015-05-20T00:00:00') };
        var newProduct3 = { orgId: testOrgId, contentType: testContentType, name: 'Doohicky', description: 'Like a widget, only better.', price: 19.99, quantity: 85, created: new Date('2015-01-27T00:00:00')  };

        before(function () {
            customDataService = new CustomDataService(database);
            // Insert some docs to be present before all tests start

            return testHelper.setupTestProducts();
            // return deleteAllTestData()
            //     .then(function(result) {
            //         return Promise.all([
            //             database.customData.insert(newProduct1),
            //             database.customData.insert(newProduct2),
            //             database.customData.insert(newProduct3)
            //         ]);
            //     })
            //     .then(function(docs) {
            //         // todo: find a more elegant way to get ids on these existing objects - maybe just use my service instead of database object
            //         existingProducts = docs;
            //         _.forEach(existingProducts, function (item) {
            //             item.id = item._id.toHexString();
            //         });
            //         return docs;
            //     })
            //     .catch(error => {
            //         console.log(error);
            //         throw error;
            //     });
        });

        after(function () {
            // Remove all Test documents
            // return deleteAllTestData();
            return testHelper.deleteAllTestProducts();
        });

        function deleteAllTestData() {
            return database.customData.remove({orgId: testOrgId, contentType: testContentType});
        }

        it("can query using an RQL query object", function () {
            var name = 'Widget';
            var query = new Query().eq('name', name);
            var expected = [];
            expected.push(testHelper.newProduct1);
            var findPromise = customDataService.find(testOrgId, query);

            return findPromise.should.eventually.deep.equal(expected);
        });

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

        it("can query using RQL limit", function () {
            var query = "eq(orgId,1)&eq(contentType,testContentType)&sort(created)&limit(2,0)"; // limit must be last
            var actual = mongoRql(query);
            let expected = {
                sort: { created: 1 },
                limit: 2
            };

            actual.should.have.deep.property("sort.created", expected.sort.created);
            actual.should.have.property("limit", expected.limit);
        });

        it("can query using multiple RQL operators", function () {
            var query = new Query().gt('price', 10.00).eq('contentType', testContentType);
            var findPromise = customDataService.find(testOrgId, query);

            return Promise.all([
                findPromise.should.eventually.be.instanceOf(Array),
                findPromise.should.eventually.have.length(2)
            ]);
        });

        it("can query using an RQL string in method format", function () {
            let expectedResults = [testHelper.newProduct1, testHelper.newProduct3];
            let query = `eq(contentType,${testContentType})&sort(created)&limit(2,0)`; // limit must come last or it won't work

            let findPromise = customDataService.find(testOrgId, query);

            return findPromise.should.eventually.deep.equal(expectedResults);
        });

        it("can query using an RQL string", function () {
            var findPromise = customDataService.find(testOrgId, 'contentType=testProducts&price=gt=10.5&quantity=lt=50');
            //var findPromise = customDataService.find('name=Widget');

            return Promise.all([
                findPromise.should.eventually.be.instanceOf(Array),
                findPromise.should.eventually.have.length(1),
                findPromise.should.eventually.have.deep.property('[0].name', newProduct2.name)
            ]);
        });

        it("can query dates using an RQL string", function () {
            //var findPromise = customDataService.find('created=lt=date:2015-06-10');
            var findPromise = customDataService.find(testOrgId, 'contentType=testProducts&created=lt=date:2015-05-10T00:00:00Z');

            //var findPromise = customDataService.find('name=Widget');

//        return findPromise.then(function (docs) {
//            var i = 0;
//        });
            return Promise.all([
                findPromise.should.eventually.be.instanceOf(Array),
                findPromise.should.eventually.have.length(2)
            ]);
        });

        // todo: Find a way to do a contains search (RegEx would be nice)
        it("can query custom string fields using regex", function () {
            var query = new Query().eq('contentType', testContentType).eq('description', /.*toy.*/i); // this one works
            var findPromise = customDataService.find(testOrgId, query);
            //var findPromise = customDataService.find(testOrgId, "contentType={0}&description=/.*toy.*/i".format(testContentType)); // does not work

            return Promise.all([
                findPromise.should.eventually.have.length(1),
                findPromise.should.eventually.have.deep.property('[0].name', newProduct2.name)
            ]);
//            return Promise.all(
//                findPromise.should.eventually.have.length(1),
//                findPromise.should.eventually.have.deep.property('[0].name', newProduct2.name)
//            );
        });

        it("can query custom number fields by value", function () {
            var findPromise = customDataService.find(testOrgId, "contentType={0}&quantity={1}".format(testContentType, 85));

            return Promise.all([
                findPromise.should.eventually.have.length(1),
                findPromise.should.eventually.have.deep.property('[0].name', newProduct3.name)
            ]);
        });
        it("can query custom number fields greater than value", function () {
            var findPromise = customDataService.find(testOrgId, "contentType={0}&quantity=gt={1}".format(testContentType, 90));

            return Promise.all([
                findPromise.should.eventually.have.length(1),
                findPromise.should.eventually.have.deep.property('[0].name', newProduct1.name)
            ]);
        });
        it("can query custom number fields in range", function () {
            var findPromise = customDataService.find(testOrgId, "contentType={0}&price=ge={1}&price=le={2}&sort(created)".format(testContentType, 5.00, 20.00));

            return Promise.all([
                findPromise.should.eventually.have.length(2),
                findPromise.should.eventually.have.deep.property('[0].name', newProduct1.name),
                findPromise.should.eventually.have.deep.property('[1].name', newProduct3.name)
            ]);
        });

        it("can query custom date fields by value", function () {
            var findDate = moment(newProduct2.created).toISOString(); //'2015-06-10T00:00:00Z';
            var findPromise = customDataService.find(testOrgId, "contentType={0}&created=date:{1}".format(testContentType, findDate));

            return Promise.all([
                findPromise.should.eventually.have.length(1),
                findPromise.should.eventually.have.deep.property('[0].name', newProduct2.name)
            ]);
        });
        it("can query custom date fields greater than value", function () {
            var findDate = '2015-01-01';
            var findPromise = customDataService.find(testOrgId, "contentType={0}&created=gt=date:{1}&sort(-created)".format(testContentType, findDate));

            return Promise.all([
                findPromise.should.eventually.have.length(2),
                findPromise.should.eventually.have.deep.property('[0].name', newProduct2.name),
                findPromise.should.eventually.have.deep.property('[1].name', newProduct3.name)
            ]);
        });
        it("can query custom date fields within range", function () {
            var startDate = '2015-01-27';
            var endDate = '2015-05-20'; // todo: this is currently failing - it succeeds if I add one day.  The le (less than or equal to) is not working.
            var findPromise = customDataService.find(testOrgId, 'contentType={0}&created=ge=date:{1}&created=le=date:{2}&sort(-created)'.format(testContentType, startDate, endDate));

            return Promise.all([
                findPromise.should.eventually.have.length(2),
                findPromise.should.eventually.have.deep.property('[0].name', newProduct2.name),
                findPromise.should.eventually.have.deep.property('[1].name', newProduct3.name)
            ]);
        });
    });


});
