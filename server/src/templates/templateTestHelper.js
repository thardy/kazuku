"use strict";
let database = require("../database/database");
let _ = require("lodash");

let testOrgId = 1;
let testSiteId = 1;
let existingTemplate1 = {};
let existingTemplate2= {};
let newTemplate1 = { orgId: testOrgId, siteId: testSiteId, name: "NewTemplate1", template: "I'm a new template", created: new Date('2014-01-01T00:00:00') };
let newTemplate2 = { orgId: testOrgId, siteId: testSiteId, name: "NewTemplate2", template: "I'm another new template", created: new Date('2015-01-01T00:00:00') };
let newTemplate3 = { orgId: testOrgId, siteId: testSiteId, name: "NewTemplate3", template: "I'm a cool new template", created: new Date('2016-01-01T00:00:00') };

let existingRegenerateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate1", template: "regenerate me", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate2", template: "regenerate me too", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate3", template: "plz regen", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate4", template: "regen ftw", regenerate: 1 }
];

let templateTestHelper = {
    testOrgId: testOrgId,
    testSiteId: testSiteId,
    setupTestTemplates: setupTestTemplates,
    deleteAllTestTemplates: deleteAllTestTemplates,
    createRegenerateList: createRegenerateList,
    existingRegenerateList: existingRegenerateList,
    existingTemplate1: existingTemplate1,
    existingTemplate2: existingTemplate2
};

function setupTestTemplates() {
    //var now = moment().format('MMMM Do YYYY, h:mm:ss a');

    return deleteAllTestTemplates()
        .then((result) => {
            return database.templates.insert(newTemplate1);
        })
        .then((doc) => {
            templateTestHelper.existingTemplate1 = doc;
            templateTestHelper.existingTemplate1.id = templateTestHelper.existingTemplate1._id.toHexString();
            return doc;
        })
        .then((result) => {
            return database.templates.insert(newTemplate2);
        })
        .then((doc) => {
            templateTestHelper.existingTemplate2 = doc;
            templateTestHelper.existingTemplate2.id = templateTestHelper.existingTemplate2._id.toHexString();
            return doc;
        })
        .then(null, (error) => {
            console.log(error);
            throw error;
        });
}

function createRegenerateList() {
    return deleteAllRegenTemplates()
        .then((result) => {
            database.templates.insert(templateTestHelper.existingRegenerateList);
        })
        .then((result) => {
            // throw in one that should not be regenerated, and actually has a regenerate property with a value of 0
            return database.templates.insert({ orgId: templateTestHelper.testOrgId, siteId: templateTestHelper.testSiteId, name: "RegenerateTemplateNOT1", template: "do not regenerate me", regenerate: 0 });
        });
}

function deleteAllTestTemplates() {
    return database.templates.remove({orgId: templateTestHelper.testOrgId});
}

function deleteAllRegenTemplates() {
    return database.templates.remove({orgId: templateTestHelper.testOrgId, name: { $regex: /^RegenerateTemplate/ }});
}

module.exports = templateTestHelper;

