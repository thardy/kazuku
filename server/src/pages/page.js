var assert = require("assert");

var Page = function(args) {
    assert.ok(args.name && args.siteId && args.url && args.content, "Need siteId, name, url, and content");
    var page = {};

    if (args._id) {
        page.id = args._id.toHexString();
    }
    else if (args.id) {
        page.id = args.id;
    }

    page.siteId = args.siteId;
    page.name = args.name;
    page.url = args.url;
    page.content = args.content;
    page.description = args.description || null;
    page.created = args.created || new Date();
    page.createdBy = args.createdBy;

    return page;
};

module.exports = Page;