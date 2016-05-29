"use strict";
var database = require("../database/database");
var _ = require("lodash");
var CustomDataService = require("../customData/customDataService");
var TemplateService = require("../templates/templateService");
var QueryService = require("../queries/queryService");
var CustomSchemaService = require("../customSchemas/customSchemaService");
var sinon = require("sinon");

let testOrgId = 1;
let testSiteId = 1;

let existingNavItems = [
    { orgId: testOrgId, contentType: "navItems", name: 'Nav1', url: '/nav1', sortOrder: 1, created: new Date('2014-01-01T00:00:00') },
    { orgId: testOrgId, contentType: "navItems", name: 'Nav2', url: '/nav2', sortOrder: 2, created: new Date('2015-05-20T00:00:00') },
    { orgId: testOrgId, contentType: "navItems", name: 'Nav3', url: '/nav3', sortOrder: 3, created: new Date('2015-01-27T00:00:00') },
];

let existingTestimonials = [
    { orgId: testOrgId, contentType: "testimonials", name: 'Joe Shmoe', testimonial: 'It\'s cool.', created: new Date('2016-05-01T00:00:00') },
    { orgId: testOrgId, contentType: "testimonials", name: 'Shelly Harvell', testimonial: 'This product or service is the best thing ever.', created: new Date('2016-05-20T00:00:00') },
    { orgId: testOrgId, contentType: "testimonials", name: 'Dan Vickers', testimonial: 'I can now be happy because of this product or service.', created: new Date('2016-05-29T00:00:00') },
];

let existingTemplateRegenerateList = [
    {
        orgId: testOrgId,
        siteId: testSiteId,
        name: "RegenerateTemplate-Navigation",
        navItems: "query(RegenerateQuery-NavItems)",
        template: "<nav><ul>{% for navItem in navItems %}<li><a href='{{navItem.url}}'>{{navItem.name}}</a></li>{% endfor %}</nav>",
        regenerate: 1
    },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate-Header", template: "<header>This is a Header</header>", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate-Footer", template: "<header>This is a Footer</header>", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate-Master", template: "{% include RegenerateTemplate-Header %} <div>{{ content }}</div> {% include RegenerateTemplate-Footer %}", regenerate: 1 }
];

let existingPageRegenerateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "RegeneratePage-HomePage", url: "home", layout: "master", template: "<h1>Home Page</h1>", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegeneratePage-About", url: "about", template: "<h1>About</h1>", regenerate: 1 }
];

let existingQueryRegenerateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateQuery-NavItems", query: "eq(contentType, navItems)&sort(sortOrder)", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateQuery-AllTestimonials", query: "eq(contentType, testimonials)&sort(-created)", regenerate: 1 }
];

// todo: what should the generated versions of these look like?
// todo: replace this with an ES6 construct (dictionary with key/value - I think it's a map
let expectedRenderedTemplates = {
    "RegenerateTemplate-Navigation": "expected output here",
    "RegenerateTemplate-Header": "expected",
    "RegenerateTemplate-Footer": "expected",
    "RegenerateTemplate-Master": "expected",
    "RegeneratePage-HomePage": "expected",
    "RegeneratePage-About": "expected"
};

var pubTestHelper = {
    testOrgId: testOrgId,
    testSiteId: testSiteId,
    createCustomData: createCustomData,
    createTemplateRegenerateList: createTemplateRegenerateList,
    createPageRegenerateList: createPageRegenerateList,
    createQueryRegenerateList: createQueryRegenerateList
};

function createCustomData() {
    return deleteAllTestCustomData()
        .then((result) => {
            database.customData.insert(existingNavItems);
        })
        .then((result) => {
            return database.customData.insert(existingTestimonials);
        });
}

function createTemplateRegenerateList() {
    return deleteAllTemplateRegenTemplates()
        .then((result) => {
            database.templates.insert(pubTestHelper.existingTemplateRegenerateList);
        })
        .then((result) => {
            // throw in one that should not be regenerated, and actually has a regenerate property with a value of 0
            return database.templates.insert({ orgId: pubTestHelper.testOrgId, siteId: pubTestHelper.testSiteId, name: "RegenerateTemplateNOT1", template: "do not regenerate me", regenerate: 0 });
        });
}

function createPageRegenerateList() {
    return deleteAllPageRegenTemplates()
        .then((result) => {
            database.templates.insert(pubTestHelper.existingPageRegenerateList);
        })
        .then((result) => {
            // throw in one that should not be regenerated, and actually has a regenerate property with a value of 0
            return database.templates.insert({ orgId: pubTestHelper.testOrgId, siteId: pubTestHelper.testSiteId, name: "RegeneratePageNOT1", url: "no-regen-page1", template: "do not regenerate me", regenerate: 0 });
        });
}

function createQueryRegenerateList() {
    return deleteAllQueryRegenTemplates()
        .then((result) => {
            return database.queries.insert(pubTestHelper.existingRegenerateList);
        })
        .then(function (result) {
            // throw in one that should not be regenerated, and actually has a regenerate property with a value of 0
            return database.queries.insert({ orgId: pubTestHelper.testOrgId, siteId: pubTestHelper.testSiteId, name: "RegenerateQueryNOT", query: "do not regenerate me", regenerate: 0 });
        });
}

function deleteAllTestCustomData() {
    return database.customData.remove({orgId: testOrgId});
}

function deleteAllTemplateRegenTemplates() {
    return database.templates.remove({orgId: pubTestHelper.testOrgId, name: { $regex: /^RegenerateTemplate/ }});
}

function deleteAllPageRegenTemplates() {
    return database.templates.remove({orgId: pubTestHelper.testOrgId, name: { $regex: /^RegeneratePage/ }});
}

function deleteAllQueryRegenTemplates() {
    return database.queries.remove({orgId: pubTestHelper.testOrgId, name: { $regex: /^RegenerateQuery/ }});
}

module.exports = pubTestHelper;

