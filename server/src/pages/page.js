//var assert = require("assert");
//
//module.exports = function() {
//    var page = {
//        create: create,
//        validate: validate
//    };
//    return page;
//
//    function create(args) {
//        //assert.ok(args.name && args.siteId && args.url && args.content, "Need siteId, name, url, and content");
//        if (!validate(args)) {
//            console.log("Need siteId, name, url, and content");
//            return null;
//        }
//
//        var page = {};
//
//        if (args._id) {
//            page.id = args._id.toHexString();
//        }
//        else if (args.id) {
//            page.id = args.id;
//        }
//
//        page.siteId = args.siteId;
//        page.name = args.name;
//        page.url = args.url;
//        page.content = args.content;
//        page.description = args.description || null;
//        page.created = args.created || new Date();
//        page.createdBy = args.createdBy;
//
//        return page;
//    }
//
//    function validate(args) {
//        var isValid = false;
//        if (args.name && args.siteId && args.url && args.content) {
//            isValid = true;
//        }
//        return isValid;
//    }
//};


//var Page = function(args) {
//    zassert.ok(args.name && args.siteId && args.url && args.content, "Need siteId, name, url, and content");
//    var page = {};
//
//    if (args._id) {
//        page.id = args._id.toHexString();
//    }
//    else if (args.id) {
//        page.id = args.id;
//    }
//
//    page.siteId = args.siteId;
//    page.name = args.name;
//    page.url = args.url;
//    page.content = args.content;
//    page.description = args.description || null;
//    page.created = args.created || new Date();
//    page.createdBy = args.createdBy;
//
//    return page;
//};
//
//module.exports = Page;