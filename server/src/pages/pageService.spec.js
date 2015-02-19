var should = require("should");
var database = require("../database/database");
var PageService = require("./pageService");
var Page = require("./page");

describe("PageService", function () {
    var pageService = {};

    before(function () {
        // todo: add some data to guarantee we have some
        pageService = new PageService(database);

    });
    after(function () {
        // todo: delete all the data we've added
    });

    it("can get all Pages", function (done) {
        pageService.getAll(function (err, data) {
            if (err) done(err);

            data.should.be.instanceof(Array);
            data.length.should.be.greaterThan(0);
            done();
        });
    });

    it("can get a Page by id", function (done) {
//        pageService.getById();
        done();
    });

    it("can create a Page", function (done) {
        var page = { siteId: 1, name: '$Test - create page', url: '#/test', content: '#Test' };
        pageService.create(page, function (err, page) {
            if (err) done(err);

            should.exist(page);
            should.exist(page.id);
            page.url.should.equal('#/test');
            done();
        });
    });

    it("can update a Page");
});

describe("Page", function () {
    it("can accept an argument object", function (done) {
        var args = { siteId: 1, name: 'chicken', url: '#/mypage', content: '#My Content' };
        var page = Page(args);
        page.url.should.be.equal('#/mypage');
        done();
    });
});
