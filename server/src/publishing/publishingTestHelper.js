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
    { orgId: testOrgId, contentType: "testimonials", name: 'Dan Vickers', testimonial: 'I can now be happy because of this product or service.', created: new Date('2016-05-29T00:00:00') },
    { orgId: testOrgId, contentType: "testimonials", name: 'Shelly Harvell', testimonial: 'This product or service is the best thing ever.', created: new Date('2016-05-20T00:00:00') },
    { orgId: testOrgId, contentType: "testimonials", name: 'Joe Shmoe', testimonial: 'It\'s cool.', created: new Date('2016-05-01T00:00:00') }
];

// todo: rename templatesForRegenerationTests because I've decided not to actually regenerate templates unless they are pages
let existingTemplateRegenerateList = [
    {
        orgId: testOrgId,
        siteId: testSiteId,
        name: "RegenerateTemplate-Navigation",
        navItems: "query(RegenerateQuery-NavItems)",
        template: "<nav><ul>{% for navItem in navItems %}<li><a href='{{navItem.url}}'>{{navItem.name}}</a></li>{% endfor %}</ul></nav>",
        regenerate: 1
    },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate-Header", template: "<header>This is a Header<br/>{% include RegenerateTemplate-Navigation %}</header>", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate-Footer", template: "<footer>This is a Footer</footer>", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate-Master", template: "{% include RegenerateTemplate-Header %} <div>{{ content }}</div> {% include RegenerateTemplate-Footer %}", regenerate: 1 }
];

let existingPageRegenerateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "RegeneratePage-HomePage", url: "home", layout: "RegenerateTemplate-Master", template: "<h1>Home Page</h1>", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegeneratePage-About", url: "about", layout: "RegenerateTemplate-Master", template: "<h1>About</h1>", regenerate: 1 }
];

let existingQueryRegenerateList = [
    // queries are VERY space sensitive currently.  need to fix.
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateQuery-NavItems", query: "eq(contentType,navItems)&sort(sortOrder)", regenerate: 1 },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateQuery-AllTestimonials", query: "eq(contentType,testimonials)&sort(-created)", regenerate: 1 }
];

let expectedRenderedTemplates = new Map();
expectedRenderedTemplates.set("RegenerateTemplate-Navigation", "<nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav>");
expectedRenderedTemplates.set("RegenerateTemplate-Header", "<header>This is a Header<br/><nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav></header>");
expectedRenderedTemplates.set("RegenerateTemplate-Footer", "<header>This is a Footer</header>");
expectedRenderedTemplates.set("RegenerateTemplate-Master", "<header>This is a Header<br/><nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav></header> <div>{{ content }}</div> <header>This is a Footer</header>");
expectedRenderedTemplates.set("RegeneratePage-HomePage", "<header>This is a Header<br/><nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav></header> <div><h1>Home Page</h1></div> <header>This is a Footer</header>");
expectedRenderedTemplates.set("RegeneratePage-About", "<header>This is a Header<br/><nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav></header> <div><h1>About</h1></div> <header>This is a Footer</header>");

let expectedRenderedQueries = new Map();
expectedRenderedQueries.set("RegenerateQuery-NavItems", existingNavItems);
expectedRenderedQueries.set("RegenerateQuery-AllTestimonials", existingTestimonials);

var pubTestHelper = {
    testOrgId: testOrgId,
    testSiteId: testSiteId,
    createCustomData: createCustomData,
    createTemplateRegenerateList: createTemplateRegenerateList,
    createPageRegenerateList: createPageRegenerateList,
    createQueryRegenerateList: createQueryRegenerateList,
    expectedRenderedTemplates: expectedRenderedTemplates,
    expectedRenderedQueries: expectedRenderedQueries
};

function createCustomData() {
    return deleteAllTestCustomData()
        .then((result) => {
            database.customData.insert(existingNavItems)
                .then(function(docs) {
                    existingNavItems = docs;
                    _.forEach(existingNavItems, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
        })
        .then((result) => {
            return database.customData.insert(existingTestimonials)
                .then(function(docs) {
                    existingTestimonials = docs;
                    _.forEach(existingTestimonials, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
        });
}

function createTemplateRegenerateList() {
    return deleteAllTemplateRegenTemplates()
        .then((result) => {
            database.templates.insert(existingTemplateRegenerateList)
                .then(function(docs) {
                    existingTemplateRegenerateList = docs;
                    _.forEach(existingTemplateRegenerateList, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
        })
        .then((result) => {
            // throw in one that should not be regenerated, and actually has a regenerate property with a value of 0
            return database.templates.insert({ orgId: pubTestHelper.testOrgId, siteId: pubTestHelper.testSiteId, name: "RegenerateTemplateNOT1", template: "do not regenerate me", regenerate: 0 });
        });
}

function createPageRegenerateList() {
    return deleteAllPageRegenTemplates()
        .then((result) => {
            database.templates.insert(existingPageRegenerateList)
                .then(function(docs) {
                    existingPageRegenerateList = docs;
                    _.forEach(existingPageRegenerateList, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
        })
        .then((result) => {
            // throw in one that should not be regenerated, and actually has a regenerate property with a value of 0
            return database.templates.insert({ orgId: pubTestHelper.testOrgId, siteId: pubTestHelper.testSiteId, name: "RegeneratePageNOT1", url: "no-regen-page1", template: "do not regenerate me", regenerate: 0 });
        });
}

function createQueryRegenerateList() {
    return deleteAllQueryRegenTemplates()
        .then((result) => {
            return database.queries.insert(existingQueryRegenerateList)
                .then(function(docs) {
                    existingQueryRegenerateList = docs;
                    _.forEach(existingQueryRegenerateList, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
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

