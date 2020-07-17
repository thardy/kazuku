'use strict';
import {database} from '../database/database.js';
import _ from 'lodash';
import testHelper from '../common/testHelper.js';

const testOrgId = testHelper.testOrgId;
const testSiteId = testHelper.testSiteId;
let existingTemplate1 = {};
let existingTemplate2= {};

let existingTemplateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplate1", nameId: 'new_template_1', template: "I'm a new template", created: new Date('2014-01-01T00:00:00') },
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplate2", nameId: 'new_template_2', template: "I'm another new template", created: new Date('2015-01-01T00:00:00') },
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplate3", nameId: 'new_template_3', template: "I'm a cool new template", created: new Date('2016-01-01T00:00:00') },
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplateLayout", nameId: 'new_template_layout', template: "<header>Some header</header>{{ content }}<footer>Some footer</footer>"},
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplateWithLayout", nameId: 'new_template_with_layout', layout: "new_template_layout", template: "<div>cool content is here</div>"},
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplateWithIncludes", nameId: 'new_template_with_includes', template: "{% include 'new_template_header' %}<div>nice content</div>{% include 'new_template_footer' %}",
        dependencies: [{type: "template", nameId: "new_template_header"}, {type: "template", nameId: "new_template_footer"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "NewAnotherTemplateWithInclude", nameId: 'new_another_template_with_include', template: "<div id='someContainer'>{% include 'new_template_header' %}</div>",
        dependencies: [{type: "template", nameId: "new_template_header"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplateThatIsPage", nameId: 'new_template_that_is_page', url: "newpage", template: "<html><body>{% include 'new_template_header' %}</body></html>",
        dependencies: [{type: "query", nameId: "some_query"}, {type: "template", nameId: "new_template_header"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplateHeader", nameId: 'new_template_header', title: "Master Title", favoriteNumber: 11, template: "<header>The real header {{title}}-{{favoriteNumber}}</header>"},
    { orgId: testOrgId, siteId: testSiteId, name: "NewTemplateFooter", nameId: 'new_template_footer', template: "<footer>The real footer</footer>"}
];

let existingRegenerateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate1", nameId: 'regenerate_template_1', template: "regenerate me", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate2", nameId: 'regenerate_template_2', template: "regenerate me too", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate3", nameId: 'regenerate_template_3', template: "plz regen", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate4", nameId: 'regenerate_template_4', template: "regen ftw", regenerate: 1 }
];

let expectedRenderedTemplates = new Map();
expectedRenderedTemplates.set("new_template_with_layout", "<header>Some header</header><div>cool content is here</div><footer>Some footer</footer>");
expectedRenderedTemplates.set("new_template_with_includes", "<header>The real header Master Title-11</header><div>nice content</div><footer>The real footer</footer>");


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
            return database.templates.insert(templateTestHelper.existingRegenerateList)
                .then((docs) => {
                    templateTestHelper.existingRegenerateList = docs;
                    _.forEach(templateTestHelper.existingRegenerateList, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
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

export default templateTestHelper;

