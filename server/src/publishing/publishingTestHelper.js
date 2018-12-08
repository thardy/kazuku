'use strict';
var database = require('../database/database').database;
var _ = require('lodash');
var CustomDataService = require('../customData/customDataService');
var TemplateService = require('../templates/templateService');
var QueryService = require('../queries/queryService');
var CustomSchemaService = require('../customSchemas/customSchemaService');
var sinon = require('sinon');
var Promise = require('bluebird');
const testHelper = require('../common/testHelper');

let testOrgId = testHelper.testOrgId;
let testSiteId = testHelper.testSiteId;

let existingNavItems = [
    { orgId: testOrgId, contentType: "nav_items", name: 'Nav1', url: '/nav1', sortOrder: 1, created: new Date('2014-01-01T00:00:00') },
    { orgId: testOrgId, contentType: "nav_items", name: 'Nav2', url: '/nav2', sortOrder: 2, created: new Date('2015-05-20T00:00:00') },
    { orgId: testOrgId, contentType: "nav_items", name: 'Nav3', url: '/nav3', sortOrder: 3, created: new Date('2015-01-27T00:00:00') },
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
        name: "RegenerateTemplate_Navigation",
        nameId: 'regenerate_template_navigation',
        navItems: "query(regenerate_query_nav_items)",
        template: "<nav><ul>{% for navItem in navItems %}<li><a href='{{navItem.url}}'>{{navItem.name}}</a></li>{% endfor %}</ul></nav>",
        dependencies: [{type: "query", nameId: "regenerate_query_nav_items"}]
    },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate_Header", nameId: 'regenerate_template_header', template: "<header>This is a Header<br/>{% include 'regenerate_template_navigation' %}</header>",
        dependencies: [{type: "template", nameId: "regenerate_template_navigation"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate_Footer", nameId: 'regenerate_template_footer', template: "<footer>This is a Footer</footer>" },
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateTemplate_Master", nameId: 'regenerate_template_master', template: "{% include 'regenerate_template_header' %} <div>{{ content }}</div> {% include 'regenerate_template_footer' %}",
        dependencies: [{type: "template", nameId: "regenerate_template_header"}, {type: "template", nameId: "regenerate_template_footer"}]}
];

let existingPageRegenerateList = [
    { orgId: testOrgId, siteId: testSiteId, name: "RegeneratePage_HomePage", nameId: 'regenerate_page_homepage', url: "home", layout: "regenerate_template_master", template: "<h1>Home Page</h1>", regenerate: 1,
        dependencies: [{type: "template", nameId: "regenerate_template_master"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "RegeneratePage_About", nameId: 'regenerate_page_about', url: "about", layout: "regenerate_template_master", template: "<h1>About</h1>", regenerate: 1,
        dependencies: [{type: "template", nameId: "regenerate_template_master"}]}
];

let existingQueryRegenerateList = [
    // queries are VERY space sensitive currently.  need to fix.
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateQuery_NavItems", nameId: 'regenerate_query_nav_items', query: "eq(contentType,nav_items)&sort(sortOrder)", regenerate: 1,
        dependencies: [{type: "data", nameId: "nav_items"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "RegenerateQuery_AllTestimonials", nameId: 'regenerate_query_alltestimonials', query: "eq(contentType,testimonials)&sort(-created)", regenerate: 1 }
];

// ********** Data for end to end tests *********************
let existingBlogPosts = [
    { orgId: testOrgId, contentType: 'blog_posts', name: 'End to End Blog Post One', body: 'This is the really cool blog post one.', created: new Date('2014-01-01T00:00:00') },
    { orgId: testOrgId, contentType: 'blog_posts', name: 'End to End Blog Post Two', body: 'Two is the best blog post ever.', created: new Date('2015-07-17T00:00:00') },
    { orgId: testOrgId, contentType: 'blog_posts', name: 'End to End Blog Post Three', body: 'The third post is always the best.', created: new Date('2016-12-01T00:00:00') }
];
let existingQueriesForEndToEndTests = [
    // queries are VERY space sensitive currently.  need to fix.
    { orgId: testOrgId, siteId: testSiteId, name: "EndToEndQuery_AllBlogs", nameId: 'end_to_end_query_allblogs', query: "eq(contentType,blog_posts)&sort(-created)", regenerate: 0,
        dependencies: [{type: "data", nameId: "blog_posts"}]}
];

let existingTemplatesForEndToEndTests = [
    {
        orgId: testOrgId,
        siteId: testSiteId,
        name: "EndToEndTemplate_BlogNav",
        nameId: 'end_to_end_template_blognav',
        blogs: "query(end_to_end_query_allblogs)",
        template: "<ul class='cool-blog-list'>{% for blog in blogs %}<li><h3>{{blog.name}}</h3></li>{% endfor %}</ul>",
        dependencies: [{type: "query", nameId: "end_to_end_query_allblogs"}]
    },
    { orgId: testOrgId, siteId: testSiteId, name: "EndToEndTemplate_Header", nameId: 'end_to_end_template_header', template: "<header>This is the end-to-end Header<br/>{% include 'end_to_end_template_blognav' %}</header>",
        dependencies: [{type: "template", nameId: "end_to_end_template_blognav"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "EndToEndTemplate_Footer", nameId: 'end_to_end_template_footer', template: "<footer>This is the end-to-end Footer</footer>" },
    { orgId: testOrgId, siteId: testSiteId, name: "EndToEndTemplate_Master", nameId: 'end_to_end_template_master', template: "{% include 'end_to_end_template_header' %} <div>{{ content }}</div> {% include 'end_to_end_template_footer' %}",
        dependencies: [{type: "template", nameId: "end_to_end_template_header"}, {type: "template", nameId: "end_to_end_template_footer"}]}
];

let existingPagesForEndToEndTests = [
    { orgId: testOrgId, siteId: testSiteId, name: "EndToEndTemplate_Home", nameId: 'end_to_end_template_home', url: "home", layout: "end_to_end_template_master", template: "<h1>End-to-End Home Page</h1>", regenerate: 0,
        dependencies: [{type: "template", nameId: "end_to_end_template_master"}]},
    { orgId: testOrgId, siteId: testSiteId, name: "EndToEndTemplate_About", nameId: 'end_to_end_template_about', url: "about", layout: "end_to_end_template_master", template: "<h1>End-to-End About</h1>", regenerate: 0,
        dependencies: [{type: "template", nameId: "end_to_end_template_master"}]}
];

// We don't render templates on their own anymore, only within the context of a page because each page can potentially alter the rendered output of an included template
// let expectedRenderedTemplates = new Map();
// expectedRenderedTemplates.set("RegenerateTemplate_Navigation", "<nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav>");
// expectedRenderedTemplates.set("RegenerateTemplate_Header", "<header>This is a Header<br/><nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav></header>");
// expectedRenderedTemplates.set("RegenerateTemplate_Footer", "<header>This is a Footer</header>");
// expectedRenderedTemplates.set("RegenerateTemplate_Master", "<header>This is a Header<br/><nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav></header> <div>{{ content }}</div> <header>This is a Footer</header>");

let expectedRenderedPages = new Map();
expectedRenderedPages.set("regenerate_page_homepage", "<header>This is a Header<br/><nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav></header> <div><h1>Home Page</h1></div> <footer>This is a Footer</footer>");
expectedRenderedPages.set("regenerate_page_about", "<header>This is a Header<br/><nav><ul><li><a href='/nav1'>Nav1</a></li><li><a href='/nav2'>Nav2</a></li><li><a href='/nav3'>Nav3</a></li></ul></nav></header> <div><h1>About</h1></div> <footer>This is a Footer</footer>");

let expectedRenderedQueries = new Map();
expectedRenderedQueries.set("regenerate_query_nav_items", existingNavItems);
expectedRenderedQueries.set("regenerate_query_alltestimonials", existingTestimonials);

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
    existingTemplatesForEndToEndTests: existingTemplatesForEndToEndTests,
    existingPageRegenerateList: existingPageRegenerateList,
    deleteAllEndToEndData: deleteAllEndToEndData,
    deleteAllTestTemplates: deleteAllTestTemplates
};

// todo: refactor all the common code out of these...
function createCustomData() {
    return deleteAllTestCustomData()
        .then((result) => {
            return database.customData.insert(existingNavItems)
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
            return database.customData.insert(existingBlogPosts)
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
            return database.templates.insert(existingTemplatesForRegenerationTests)
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
    return database.templates.insert(existingTemplatesForEndToEndTests)
        .then(function(docs) {
            existingTemplatesForEndToEndTests = docs;
            _.forEach(existingTemplatesForEndToEndTests, function (item) {
                item.id = item._id.toHexString();
            });
            return docs;
        });
}

function createPagesForEndToEndTests() {
    return database.templates.insert(existingPagesForEndToEndTests)
        .then(function(docs) {
            existingPagesForEndToEndTests = docs;
            _.forEach(existingPagesForEndToEndTests, function (item) {
                item.id = item._id.toHexString();
            });
            return docs;
        });
}

function createPageRegenerateList() {
    return deleteAllPageRegenTemplates()
        .then((result) => {
            return database.templates.insert(existingPageRegenerateList)
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
            return database.templates.insert({ orgId: pubTestHelper.testOrgId, siteId: pubTestHelper.testSiteId, name: "RegeneratePageNOT1", url: "no_regen_page1", template: "do not regenerate me", regenerate: 0 });
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
    return deleteAllTestQueries()
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
    promises.push(deleteAllEndToEndTemplates());
    promises.push(deleteAllEndToEndQueries());
    promises.push(deleteAllEndToEndPages());
    return Promise.all(promises);
}

function deleteAllTestCustomData() {
    return database.customData.remove({orgId: testOrgId});
}

function deleteCustomDataForEndToEndTests() {
    return database.customData.remove({orgId: testOrgId, contentType: 'blog_posts'});
}

function deleteAllTemplateRegenTemplates() {
    return database.templates.remove({orgId: testOrgId, name: { $regex: /^RegenerateTemplate/ }});
}

function deleteAllPageRegenTemplates() {
    return database.templates.remove({orgId: testOrgId, name: { $regex: /^RegeneratePage/ }});
}

function deleteAllQueryRegenTemplates() {
    return database.queries.remove({orgId: testOrgId, name: { $regex: /^RegenerateQuery/ }});
}

function deleteAllEndToEndQueries() {
    return database.queries.remove({orgId: testOrgId, name: { $regex: /^EndToEndQuery/ }});
}

function deleteAllTestQueries() {
    return database.queries.remove({orgId: testOrgId});
}

function deleteAllEndToEndTemplates() {
    return database.templates.remove({orgId: testOrgId, name: { $regex: /^EndToEndTemplate/ }});
}

function deleteAllEndToEndPages() {
    return database.templates.remove({orgId: testOrgId, name: { $regex: /^EndToEndPage/ }});
}

function deleteAllTestPages() {
    return database.templates.remove({orgId: testOrgId, url: { $exists: true }});
}

function deleteAllTestTemplates() {
    return database.templates.remove({orgId: testOrgId});
}

module.exports = pubTestHelper;

