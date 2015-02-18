var assert = require("assert");

var Page = function(args) {
    assert.ok(args.name && args.siteId && args.url && args.content, "Need siteId, name, url, and content");
    var page = {};

    if (args.id) {
        page.id = args.id;
    }
    page.name = args.name;
    page.siteId = args.siteId;
    page.url = args.url;
    page.content = args.content;
    page.description = args.description || null;
    page.created = args.created || new Date();
    page.createdBy = args.createdBy;

    return page;
};

module.exports = Page;