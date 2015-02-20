var should = require("should");
var database = require("../database/database");
var PageService = require("./pageService");
var Page = require("./page");
var _ = require("lodash");

describe("PageService", function () {
    var pageService = {};
    var existingPage1IdString = {};
    var existingPage2IdString = {};
    var existingPage1Name = '';
    var existingPage2Name = '';
    var existingPage2Url = '';
    var theUpdatedPage = {};

    before(function (done) {
        pageService = new PageService(database);

        deleteAllTestPages(function() {
            // Insert a doc to be present before all tests start
            database.pages.insert({name: '$Test Page 1 - existing', siteId: 1, url: '#/test', content: '#Test Page 1 - Existing'},
                function (err, doc) {
                    if(err) return done(err);

                    existingPage1IdString = doc._id.toHexString();
                    existingPage1Name = doc.name;

                    database.pages.insert({name: '$Test Page 2 - existing', siteId: 1, url: '#/test2', content: '#Test Page 2 - Existing'},
                        function (err, doc) {
                            if(err) return done(err);

                            existingPage2IdString = doc._id.toHexString();
                            existingPage2Name = doc.name;
                            existingPage2Url = doc.url;
                            done();
                        }
                    );
                }
            );
        });
    });

    after(function () {
        // Remove all Test documents
        deleteAllTestPages();
    });

    it("can get all Pages", function (done) {
        pageService.getAll(function (err, pages) {
            if (err) done(err);

            pages.should.be.instanceOf(Array);
            pages.length.should.be.greaterThan(1);
            done();
        });
    });

    it("can get a Page by id", function (done) {
        pageService.getById(existingPage1IdString, function(err, page) {
            if (err) done(err);

            should.exist(page);
            page.name.should.equal(existingPage1Name);
        });
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

    it("can update a Page by id", function (done) {
        var newUrl = '#/newtest';
        var newContent = '#New Test Content';
        _.assign(theUpdatedPage, { id: existingPage1IdString, siteId: 1, name: existingPage1Name, url: newUrl, content: newContent });
        pageService.updateById(existingPage1IdString, theUpdatedPage, function (err, numAffected) {
            if (err) done(err);

            numAffected.should.equal(1);

            // verify page was updated
            pageService.getById(existingPage1IdString, function(err, retrievedPage) {
                if (err) done(err);

                should.exist(retrievedPage);
                retrievedPage.url.should.be.equal(newUrl);
                retrievedPage.content.should.be.equal(newContent);
                done();
            });
        });
    });

    it("can update a Page by query object", function (done) {
        var newUrl = '#/newtest2';
        var newContent = '#New Test Content for query by object';
        var updatedPage = { id: existingPage2IdString, siteId: 1, name: existingPage2Name, url: newUrl, content: newContent };
        var queryObject = { name: existingPage2Name, url: existingPage2Url};
        pageService.update(queryObject, updatedPage, function (err, numAffected) {
            if (err) done(err);

            numAffected.should.equal(1);

            // verify page was updated
            pageService.getById(existingPage2IdString, function(err, retrievedPage) {
                if (err) done(err);

                should.exist(retrievedPage);
                retrievedPage.url.should.be.equal(newUrl);
                retrievedPage.content.should.be.equal(newContent);
                done();
            });
        });
    });

    it("can delete a Page by id", function (done) {
        var newPage = { siteId: 1, name: '$Test - deleting this one', url: '#/delete', content: '#Delete' };
        pageService.create(newPage, function(err, page) {
            if (err) done(err);

            pageService.delete(page.id, function(err) {
                if (err) done(err);

                pageService.getById(page.id, function(err, retrievedPage) {
                    if (err) done(err);

                    should.not.exist(retrievedPage);
                    done();
                });
            });
        });
    });

    function deleteAllTestPages(next) {
        database.pages.remove({name: /^\$Test.*/, siteId: 1}, function (err) {
            if(err) return next(err);

            next();
        });
    }
});

describe("Page", function () {
    it("can accept an argument object", function (done) {
        var args = { siteId: 1, name: 'chicken', url: '#/mypage', content: '#My Content' };
        var page = Page(args);
        page.url.should.be.equal('#/mypage');
        done();
    });
});
