"use strict";
let database = require("../database/database").database;
let _ = require("lodash");

let testOrgId = 1;
let testSiteId = 1;
let existingTemplate1 = {};
let existingTemplate2= {};

let existingTemplateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplate1", template: "I'm a new template", created: new Date('2014-01-01T00:00:00') },
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplate2", template: "I'm another new template", created: new Date('2015-01-01T00:00:00') },
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplate3", template: "I'm a cool new template", created: new Date('2016-01-01T00:00:00') },
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplateLayout", template: "<header>Some header</header>{{ content }}<footer>Some footer</footer>"},
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplateWithLayout", layout: "NewTemplateLayout", template: "<div>cool content is here</div>"},
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplateWithIncludes", template: "{% include 'NewTemplateHeader' %}<div>nice content</div>{% include 'NewTemplateFooter' %}",
        dependencies: [{type: "template", name: "NewTemplateHeader"}, {type: "template", name: "NewTemplateFooter"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "NewAnotherTemplateWithInclude", template: "<div id='someContainer'>{% include 'NewTemplateHeader' %}</div>",
        dependencies: [{type: "template", name: "NewTemplateHeader"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplateThatIsPage", url: "newpage", template: "<html><body>{% include 'NewTemplateHeader' %}</body></html>",
        dependencies: [{type: "query", name: "someQuery"}, {type: "template", name: "NewTemplateHeader"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplateHeader", title: "Master Title", favoriteNumber: 11, template: "<header>The real header {{title}}-{{favoriteNumber}}</header>"},
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplateFooter", template: "<footer>The real footer</footer>"}
];

let existingRegenerateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate1", template: "regenerate me", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate2", template: "regenerate me too", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate3", template: "plz regen", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate4", template: "regen ftw", regenerate: 1 }
];

let expectedRenderedTemplates = new Map();
expectedRenderedTemplates.set("NewTemplateWithLayout", "<header>Some header</header><div>cool content is here</div><footer>Some footer</footer>");
expectedRenderedTemplates.set("NewTemplateWithIncludes", "<header>The real header Master Title-11</header><div>nice content</div><footer>The real footer</footer>");


let templateTestHelper = {
    testOrgId: testOrgId,
    testSiteId: testSiteId,
    createTemplateList: createTemplateList,
    deleteAllTestTemplates: deleteAllTestTemplates,
    createRegenerateList: createRegenerateList,
    expectedRenderedTemplates: expectedRenderedTemplates,
    existingRegenerateList: existingRegenerateList,
    existingTemplate1: existingTemplate1,
    existingTemplate2: existingTemplate2
};

//function setupTestTemplates() {
//    //var now = moment().format('MMMM Do YYYY, h:mm:ss a');
//
//    return deleteAllTestTemplates()
//        .then((result) => {
//            return database.templates.insert(newTemplate1);
//        })
//        .then((doc) => {
//            templateTestHelper.existingTemplate1 = doc;
//            templateTestHelper.existingTemplate1.id = templateTestHelper.existingTemplate1._id.toHexString();
//            return doc;
//        })
//        .then((result) => {
//            return database.templates.insert(newTemplate2);
//        })
//        .then((doc) => {
//            templateTestHelper.existingTemplate2 = doc;
//            templateTestHelper.existingTemplate2.id = templateTestHelper.existingTemplate2._id.toHexString();
//            return doc;
//        })
//        .catch(error => {
//            console.log(error);
//            throw error;
//        });
//}

function createTemplateList() {
    return deleteAllNewTemplates()
        .then((result) => {
            database.templates.insert(existingTemplateList)
                .then((docs) => {
                    existingTemplateList = docs;
                    _.forEach(existingTemplateList, function (item) {
                        item.id = item._id.toHexString();
                    });

                    templateTestHelper.existingTemplate1 = _.find(existingTemplateList, {name: "NewTemplate1"});
                    templateTestHelper.existingTemplate2 = _.find(existingTemplateList, {name: "NewTemplate2"});
                    return docs;
                });
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

function deleteAllNewTemplates() {
    return database.templates.remove({orgId: templateTestHelper.testOrgId, name: { $regex: /^NewTemplate/ }});
}

function deleteAllTestTemplates() {
    return database.templates.remove({orgId: templateTestHelper.testOrgId});
}

function deleteAllRegenTemplates() {
    return database.templates.remove({orgId: templateTestHelper.testOrgId, name: { $regex: /^RegenerateTemplate/ }});
}

module.exports = templateTestHelper;

