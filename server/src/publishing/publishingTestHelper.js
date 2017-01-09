"use strict";
var database = require("../database/database");
var _ = require("lodash");
var CustomDataService = require("../customData/customDataService");
var TemplateService = require("../templates/templateService");
var QueryService = require("../queries/queryService");
var CustomSchemaService = require("../customSchemas/customSchemaService");
var sinon = require("sinon");
var Promise = require("bluebird");

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

let existingTemplatesForRegenerationTests = [
    {
        orgId: testOrgId,
        siteId: testSiteId,
        name: "RegenerateTemplate-Navigation",
        navItems: "query(RegenerateQuery-NavItems)",
        template: "<nav><ul>{% for navItem in navItems %}<li><a href='{{navItem.url}}'>{{navItem.name}}</a></li>{% endfor %}</ul></nav>",
        dependencies: [{type: "query", name: "RegenerateQuery-NavItems"}]
    },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate-Header", template: "<header>This is a Header<br/>{% include 'RegenerateTemplate-Navigation' %}</header>",
        dependencies: [{type: "template", name: "RegenerateTemplate-Navigation"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate-Footer", template: "<footer>This is a Footer</footer>" },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate-Master", template: "{% include 'RegenerateTemplate-Header' %} <div>{{ content }}</div> {% include 'RegenerateTemplate-Footer' %}",
        dependencies: [{type: "template", name: "RegenerateTemplate-Header"}, {type: "template", name: "RegenerateTemplate-Footer"}]}
];

let existingPageRegenerateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "RegeneratePage-HomePage", url: "home", layout: "RegenerateTemplate-Master", template: "<h1>Home Page</h1>", regenerate: 1,
        dependencies: [{type: "template", name: "RegenerateTemplate-Master"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "RegeneratePage-About", url: "about", layout: "RegenerateTemplate-Master", template: "<h1>About</h1>", regenerate: 1,
        dependencies: [{type: "template", name: "RegenerateTemplate-Master"}]}
];

let existingQueryRegenerateList = [
    // queries are VERY space sensitive currently.  need to fix.
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateQuery-NavItems", query: "eq(contentType,navItems)&sort(sortOrder)", regenerate: 1,
        dependencies: [{type: "data", name: "navItems"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateQuery-AllTestimonials", query: "eq(contentType,testimonials)&sort(-created)", regenerate: 1 }
];

// ********** Data for end to end tests *********************
let existingBlogPosts = [
    { orgId: testOrgId, contentType: 'blogPosts', title: 'End to End Blog Post One', body: 'This is the really cool blog post one.', created: new Date('2014-01-01T00:00:00') },
    { orgId: testOrgId, contentType: 'blogPosts', title: 'End to End Blog Post Two', body: 'Two is the best blog post ever.', created: new Date('2015-07-17T00:00:00') },
    { orgId: testOrgId, contentType: 'blogPosts', title: 'End to End Blog Post Three', body: 'The third post is always the best.', created: new Date('2016-12-01T00:00:00') }
];
let existingQueriesForEndToEndTests = [
    // queries are VERY space sensitive currently.  need to fix.
    { orgId: testOrgId, siteId: testSiteId, name: "EndToEndQuery-AllBlogs", query: "eq(contentType,blogPosts)&sort(-created)", regenerate: 0,
        dependencies: [{type: "data", name: "blogPosts"}]}
];

let existingTemplatesForEndToEndTests = [
    {
        orgId: testOrgId,
        siteId: testSiteId,
        name: "EndToEndTemplate-BlogNav",
        blogs: "query(EndToEndQuery-AllBlogs)",
        template: "<ul class='cool-blog-list'>{% for blog in blogs %}<li><h3>{{blog.name}}</h3></li>{% endfor %}</ul>",
        dependencies: [{type: "query", name: "EndToEndQuery-AllBlogs"}]
    },
    { orgId: testOrgId, siteId: testSiteId, name: "EndToEndTemplate-Header", template: "<header>This is the end-to-end Header<br/>{% include 'EndToEndTemplate-BlogNav' %}</header>",
        dependencies: [{type: "template", name: "EndToEndTemplate-BlogNav"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "EndToEndTemplate-Footer", template: "<footer>This is the end-to-end Footer</footer>" },
    { orgId: testOrgId, siteId: testSiteId, name: "EndToEndTemplate-Master", template: "{% include 'EndToEndTemplate-Header' %} <div>{{ content }}</div> {% include 'EndToEndTemplate-Footer' %}",
        dependencies: [{type: "template", name: "EndToEndTemplate-Header"}, {type: "template", name: "EndToEndTemplate-Footer"}]}
];

let existingPagesForEndToEndTests = [
    { orgId: testOrgId, siteId: testSiteId, name: "EndToEndTemplate-Home", url: "home", layout: "EndToEndTemplate-Master", template: "<h1>End-to-End Home Page</h1>", regenerate: 0,
        dependencies: [{type: "template", name: "EndToEndTemplate-Master"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "EndToEndTemplate-About", url: "about", layout: "EndToEndTemplate-Master", template: "<h1>End-to-End About</h1>", regenerate: 0,
        dependencies: [{type: "template", name: "EndToEndTemplate-Master"}]}
];

// We don't render templates on their own anymore, only within the context of a page because each page can potentially alter the rendered output of an included template
// let expectedRenderedTemplates = new Map();
// expectedRenderedTemplates.set("RegenerateTemplate-Navigation", "<nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav>");
// expectedRenderedTemplates.set("RegenerateTemplate-Header", "<header>This is a Header<br/><nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav></header>");
// expectedRenderedTemplates.set("RegenerateTemplate-Footer", "<header>This is a Footer</header>");
// expectedRenderedTemplates.set("RegenerateTemplate-Master", "<header>This is a Header<br/><nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav></header> <div>{{ content }}</div> <header>This is a Footer</header>");

let expectedRenderedPages = new Map();
expectedRenderedPages.set("RegeneratePage-HomePage", "<header>This is a Header<br/><nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav></header> <div><h1>Home Page</h1></div> <footer>This is a Footer</footer>");
expectedRenderedPages.set("RegeneratePage-About", "<header>This is a Header<br/><nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav></header> <div><h1>About</h1></div> <footer>This is a Footer</footer>");

let expectedRenderedQueries = new Map();
expectedRenderedQueries.set("RegenerateQuery-NavItems", existingNavItems);
expectedRenderedQueries.set("RegenerateQuery-AllTestimonials", existingTestimonials);

var pubTestHelper = {
    testOrgId: testOrgId,
    testSiteId: testSiteId,
    createCustomData: createCustomData,
    createTemplatesForRegenerationTests: createTemplatesForRegenerationTests,
    createPageRegenerateList: createPageRegenerateList,
    createQueryRegenerateList: createQueryRegenerateList,
    createCustomDataForEndToEndTests: createCustomDataForEndToEndTests,
    createQueriesForEndToEndTests: createQueriesForEndToEndTests,
    createTemplatesForEndToEndTests: createTemplatesForEndToEndTests,
    createPagesForEndToEndTests: createPagesForEndToEndTests,
    //expectedRenderedTemplates: expectedRenderedTemplates,
    expectedRenderedPages: expectedRenderedPages,
    expectedRenderedQueries: expectedRenderedQueries,
    deleteAllEndToEndData: deleteAllEndToEndData
};

// todo: refactor all the common code out of these...
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

function createCustomDataForEndToEndTests() {
    return deleteCustomDataForEndToEndTests()
        .then((result) => {
            database.customData.insert(existingBlogPosts)
                .then(function(docs) {
                    existingBlogPosts = docs;
                    _.forEach(existingBlogPosts, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
        });
}

function createTemplatesForRegenerationTests() {
    return deleteAllTemplateRegenTemplates()
        .then((result) => {
            database.templates.insert(existingTemplatesForRegenerationTests)
                .then(function(docs) {
                    existingTemplatesForRegenerationTests = docs;
                    _.forEach(existingTemplatesForRegenerationTests, function (item) {
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

function createTemplatesForEndToEndTests() {
    return deleteAllEndToEndTemplates()
        .then((result) => {
            database.templates.insert(existingTemplatesForEndToEndTests)
                .then(function(docs) {
                    existingTemplatesForEndToEndTests = docs;
                    _.forEach(existingTemplatesForEndToEndTests, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
        });
}

function createPagesForEndToEndTests() {
    return deleteAllEndToEndPages()
        .then((result) => {
            database.templates.insert(existingPagesForEndToEndTests)
                .then(function(docs) {
                    existingPagesForEndToEndTests = docs;
                    _.forEach(existingPagesForEndToEndTests, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
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

function createQueriesForEndToEndTests() {
    return deleteAllEndToEndQueries()
        .then((result) => {
            return database.queries.insert(existingQueriesForEndToEndTests)
                .then(function(docs) {
                    existingQueriesForEndToEndTests = docs;
                    _.forEach(existingQueriesForEndToEndTests, function (item) {
                        item.id = item._id.toHexString();
                    });
                    return docs;
                });
        });
}

function deleteAllEndToEndData() {
    let promises = [];
    promises.push(deleteCustomDataForEndToEndTests());
    promises.push(deleteAllEndToEndTemplates);
    promises.push(deleteAllEndToEndQueries());
    promises.push(deleteAllEndToEndPages());
    return Promise.all(promises);
}

function deleteAllTestCustomData() {
    return database.customData.remove({orgId: testOrgId});
}

function deleteCustomDataForEndToEndTests() {
    return database.customData.remove({orgId: testOrgId, contentType: 'blogPosts'});
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

function deleteAllEndToEndQueries() {
    return database.queries.remove({orgId: pubTestHelper.testOrgId, name: { $regex: /^EndToEndQuery/ }});
}

function deleteAllEndToEndTemplates() {
    return database.templates.remove({orgId: pubTestHelper.testOrgId, name: { $regex: /^EndToEndTemplate/ }});
}

function deleteAllEndToEndPages() {
    return database.templates.remove({orgId: pubTestHelper.testOrgId, name: { $regex: /^EndToEndPage/ }});
}

module.exports = pubTestHelper;

