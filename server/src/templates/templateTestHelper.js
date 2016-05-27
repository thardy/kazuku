"use strict";
var database = require("../database/database");
var _ = require("lodash");

let testOrgId = 1;
let testSiteId = 1;
let newTemplate1 = { orgId: testOrgId, siteId: testSiteId, name: "NewTemplate1", template: "I'm a new template", created: new Date('2014-01-01T00:00:00') };
let newTemplate2 = { orgId: testOrgId, siteId: testSiteId, name: "NewTemplate2", template: "I'm another new template", created: new Date('2015-01-01T00:00:00') };
let newTemplate3 = { orgId: testOrgId, siteId: testSiteId, name: "NewTemplate3", template: "I'm a cool new template", created: new Date('2016-01-01T00:00:00') };

// todo: change template properties to actual templates that can be generated and their outputs tested (start from test)
let existingRegenerateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "TemplateToRegenerate1", template: "plz regenerate me", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "TemplateToRegenerate2", template: "needz regenerating", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "TemplateToRegenerate3", template: "regen ftw", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "TemplateToRegenerate4", template: "can haz regenerations?", regenerate: 1 },
];

var templateTestHelper = {
    //setupItemsToBeRegenerated: setupItemsToBeRegenerated,
    deleteAllTestTemplates: deleteAllTestTemplates,
    createRegenerateList: createRegenerateList,
    existingRegenerateList: existingRegenerateList
};

//function setupItemsToBeRegenerated() {
//    return deleteAllRegenerationTestTemplates()
//        .then(function(result) {
//            return createRegenerateList();
//        })
//        .catch(function (error) {
//            console.log(error);
//            throw error;
//        })
//}

function createTestTemplates() {
    //var now = moment().format('MMMM Do YYYY, h:mm:ss a');

    return Promise.all([
        database.templates.insert(newTemplate1),
        database.templates.insert(newTemplate2),
        database.templates.insert(newTemplate3)
    ])
        .then(function(docs) {
            pubTestHelper.existingTemplates = docs;
            _.forEach(pubTestHelper.existingTemplates, function (item) {
                item.id = item._id.toHexString();
            });
            return docs;
        })
        .then(null, function(error) {
            console.log(error);
            throw error;
        });

}

function createRegenerateList() {
    return database.templates.insert(existingRegenerateList)
        .then(function (result) {
            // throw in one that should not be regenerated, and actually has a regenerate property with a value of 0
            return database.templates.insert({ orgId: testOrgId, siteId: testSiteId, name: "TemplateToNOTRegenerate1", template: "do not regenerate me", regenerate: 0 });
        });
}

function deleteAllTestTemplates() {
    return database.templates.remove({orgId: testOrgId});
}

module.exports = templateTestHelper;

