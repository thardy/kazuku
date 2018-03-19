"use strict";
var database = require("../database/database").database;
var _ = require("lodash");
const testHelper = require('../common/testHelper');

let testOrgId = testHelper.testOrgId;
let testSiteId = 1;
let existingQuery1 = {};
let existingQuery2= {};
let testQueryDataContentType = "testQueryDataContentType";

let newQuery1 = {
    orgId: testOrgId,
    siteId: testSiteId,
    name: "TestQuery1",
    query: "test query one"
};
let newQuery2 = {
    orgId: testOrgId,
    siteId: testSiteId,
    name: "TestQuery2",
    query: "test query two"
};
let existingDataQueries = [
    { orgId: testOrgId, siteId: testSiteId, name: "DataQuery-one", query: `eq(contentType,${testQueryDataContentType})&sort(created)&limit(2,0)`,
        dependencies: [{type: "data", name: `${testQueryDataContentType}`}]},
    { orgId: testOrgId, siteId: testSiteId, name: "DataQuery-two", query: `eq(contentType,${testQueryDataContentType})&sort(-created)&limit(3,0)`,
        dependencies: [{type: "data", name: `${testQueryDataContentType}`}]},
    { orgId: testOrgId, siteId: testSiteId, name: "DataQuery-three", query: `eq(contentType,${testQueryDataContentType})&ge(created,date:2016-02-20)&sort(created)&limit(2,0)`,
        dependencies: [{type: "data", name: `${testQueryDataContentType}`}]}
];

let existingQueryData = [
    { orgId: testOrgId, contentType: testQueryDataContentType, name: 'QueryData-One', description: 'This is One.', someNumber: 10, created: new Date('2016-01-20T00:00:00') },
    { orgId: testOrgId, contentType: testQueryDataContentType, name: 'QueryData-Two', description: 'This is Two.', someNumber: 20, created: new Date('2016-02-20T00:00:00') },
    { orgId: testOrgId, contentType: testQueryDataContentType, name: 'QueryData-Three', description: 'This is Three.', someNumber: 30, created: new Date('2016-03-20T00:00:00') },
    { orgId: testOrgId, contentType: testQueryDataContentType, name: 'QueryData-Four', description: 'This is Four.', someNumber: 40, created: new Date('2016-04-20T00:00:00') }
];

let existingRegenerateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateQuery-HeaderNavigation", query: "something", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateQuery-AllTestimonials", query: "query needz regenerating", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateQuery-TopProducts", query: "query regen ftw", regenerate: 1 }
];


let queryTestHelper = {
    testOrgId: testOrgId,
    testSiteId: testSiteId,
    testQueryDataContentType: testQueryDataContentType,
    setupTestQueries: setupTestQueries,
    deleteAllTestQueries: deleteAllTestQueries,
    deleteAllQueryData: deleteAllQueryData,
    createRegenerateList: createRegenerateList,
    createExistingDataQueries: createExistingDataQueries,
    createExistingQueryData: createExistingQueryData,
    existingRegenerateList: existingRegenerateList,
    existingQueryData: existingQueryData,
    existingQuery1: existingQuery1,
    existingQuery2: existingQuery2
};

function setupTestQueries() {
    //var now = moment().format('MMMM Do YYYY, h:mm:ss a');

    return deleteAllTestQueries()
        .then((result) => {
            return database.queries.insert(newQuery1);
        })
        .then((doc) => {
            queryTestHelper.existingQuery1 = doc;
            queryTestHelper.existingQuery1.id = queryTestHelper.existingQuery1._id.toHexString();
            return doc;
        })
        .then((result) => {
            return database.queries.insert(newQuery2);
        })
        .then((doc) => {
            queryTestHelper.existingQuery2 = doc;
            queryTestHelper.existingQuery2.id = queryTestHelper.existingQuery2._id.toHexString();
            return doc;
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

function createExistingDataQueries() {
    return deleteAllDataQueries()
        .then((result) => {
            return database.queries.insert(existingDataQueries)
                .then(function(docs) {
                    existingDataQueries = docs;
                    _.forEach(existingDataQueries, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
        });
}

function createExistingQueryData() {
    return deleteAllQueryData()
        .then((result) => {
            return database.customData.insert(existingQueryData)
                .then(function(docs) {
                    existingQueryData = docs;
                    _.forEach(existingQueryData, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
        });
}

function createRegenerateList() {
    return deleteAllRegenQueries()
        .then((result) => {
            return database.queries.insert(existingRegenerateList)
                .then(function(docs) {
                    existingRegenerateList = docs;
                    _.forEach(existingRegenerateList, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
        })
        .then(function (result) {
            // throw in one that should not be regenerated, and actually has a regenerate property with a value of 0
            return database.queries.insert({ orgId: queryTestHelper.testOrgId, siteId: queryTestHelper.testSiteId, name: "RegenerateQueryNOT", query: "do not regenerate me", regenerate: 0 });
        });
}

function deleteAllTestQueries() {
    return database.queries.remove({orgId: queryTestHelper.testOrgId});
}

function deleteAllRegenQueries() {
    return database.queries.remove({orgId: queryTestHelper.testOrgId, name: { $regex: /^RegenerateQuery/ }});
}

function deleteAllDataQueries() {
    return database.queries.remove({orgId: queryTestHelper.testOrgId, name: { $regex: /^DataQuery-/ }});
}

function deleteAllQueryData() {
    return database.customData.remove({orgId: queryTestHelper.testOrgId, name: { $regex: /^QueryData-/ }});
}


module.exports = queryTestHelper;


