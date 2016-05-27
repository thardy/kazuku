"use strict";
var database = require("../database/database");
var _ = require("lodash");

let testOrgId = 1;
let testSiteId = 1;
let existingQuery1 = {};
let existingQuery2= {};

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

// todo: change query properties to actual queries for testing, maybe???
let existingRegenerateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "QueryToRegenerate1", query: "plz regenerate this query", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "QueryToRegenerate2", query: "query needz regenerating", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "QueryToRegenerate3", query: "query regen ftw", regenerate: 1 }
];


var queryTestHelper = {
    testOrgId: testOrgId,
    testSiteId: testSiteId,
    setupTestQueries: setupTestQueries,
    deleteAllTestQueries: deleteAllTestQueries,
    createRegenerateList: createRegenerateList,
    existingRegenerateList: existingRegenerateList,
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
        .then(null, (error) => {
            console.log(error);
            throw error;
        });
}

function createRegenerateList() {
    return database.queries.insert(queryTestHelper.existingRegenerateList)
        .then(function (result) {
            // throw in one that should not be regenerated, and actually has a regenerate property with a value of 0
            return database.queries.insert({ orgId: queryTestHelper.testOrgId, siteId: queryTestHelper.testSiteId, name: "QueryToNOTRegenerate1", query: "do not regenerate me", regenerate: 0 });
        });
}

function deleteAllTestQueries() {
    return database.queries.remove({orgId: queryTestHelper.testOrgId});
}

module.exports = queryTestHelper;


