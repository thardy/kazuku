var chai = require("chai");
var should = chai.Should();
var database = require("../database/database");
var PageService = require("./pageService");
var Page = require("./page");
var _ = require("lodash");
var async = require("async");

describe("PageService", function () {
    var pageService = {};
    var existingPage1 = {};
    var existingPage1IdString = {};
    var existingPage2IdString = {};
    var existingPage1Name = '';
    var existingPage2Name = '';
    var existingPage2Url = '';
    var theUpdatedPage = {};
    var testOrgId = 1;

    before(function (done) {
        pageService = new PageService(database);

        // todo: consider adding orgId to pages
        deleteAllTestPages(function() {
            // Insert a doc to be present before all tests start
            var newPage = {name: '$Test Page 1 - existing', orgId: testOrgId, siteId: 1, url: '#/test', content: '#Test Page 1 - Existing'};
            var newPage2 = {name: '$Test Page 2 - existing', orgId: testOrgId, siteId: 1, url: '#/test2', content: '#Test Page 2 - Existing'};
            async.parallel([
                function(callback) {
                    database.pages.insert(newPage, function(err, doc) {
                        if (err) return callback(err);

                        existingPage1 = doc;
                        existingPage1IdString = doc._id.toHexString();
                        existingPage1Name = doc.name;
                        callback();
                    });
                },
                function(callback) {
                    database.pages.insert(newPage2, function(err, doc) {
                        if (err) return callback(err);

                        existingPage2IdString = doc._id.toHexString();
                        existingPage2Name = doc.name;
                        existingPage2Url = doc.url;
                        callback();
                    });
                }
            ], function (err) {
                if (err) return done(err);

                done();
            });
        });
    });

    after(function (done) {
        // Remove all Test documents
        deleteAllTestPages(function() {
            done();
        });
    });

    it("can get all Pages", function (done) {
        pageService.getAll(function (err, pages) {
            if (err) return done(err);

            pages.should.be.instanceOf(Array);
            pages.length.should.be.greaterThan(1);
            done();
        });
    });

    it("can get a Page by id", function (done) {
        pageService.getById(existingPage1IdString, function(err, page) {
            if (err) return done(err);

            should.exist(page);
            page.name.should.equal(existingPage1Name);
            done();
        });
    });

    it("can create a Page", function (done) {
        var page = { orgId: testOrgId, siteId: 1, name: '$Test - create page', url: '#/created', content: '#Test' };
        pageService.create(page, function (err, page) {
            if (err) return done(err);

            should.exist(page);
            should.exist(page.id);
            page.url.should.equal('#/created');
            done();
        });
    });

    it("validates Page on create using base validation - orgId", function (done) {
        var invalidPage = { name: '$Test - create page', siteId: 1, url: '#/invalid-page', content: '#Test' };
        pageService.create(invalidPage, function (err, page) {
            should.exist(err);
            should.not.exist(page);
            done();
        });
    });

    it("validates Page on create using extended validation - name, url, content", function (done) {
        var invalidPage = { orgId: testOrgId, siteId: 1, name: '$Test - create page', url: '#/invalid-page' };
        pageService.create(invalidPage, function (err, page) {
            should.exist(err);
            should.not.exist(page);
            done();
        });
    });

    it("can update a Page by id", function (done) {
        var newContent = '#New Test Content';
        _.assign(theUpdatedPage, { id: existingPage1IdString, siteId: 1, name: existingPage1Name, content: newContent });
        pageService.updateById(existingPage1IdString, theUpdatedPage, function (err, numAffected) {
            if (err) return done(err);

            numAffected.should.equal(1);

            // verify page was updated
            pageService.getById(existingPage1IdString, function(err, retrievedPage) {
                if (err) return done(err);

                should.exist(retrievedPage);
                retrievedPage.content.should.be.equal(newContent);
                done();
            });
        });
    });

    it("can update a Page by query object", function (done) {
        var newUrl = '#/updated-url2';
        var newContent = '#New Test Content for query by object';
        var updatedPage = { id: existingPage2IdString, orgId: testOrgId, siteId: 1, name: existingPage2Name, url: newUrl, content: newContent };
        var queryObject = { name: existingPage2Name, url: existingPage2Url};
        pageService.update(queryObject, updatedPage, function (err, numAffected) {
            if (err) return done(err);

            numAffected.should.equal(1);

            // verify page was updated
            pageService.getById(existingPage2IdString, function(err, retrievedPage) {
                if (err) return done(err);

                should.exist(retrievedPage);
                retrievedPage.url.should.be.equal(newUrl);
                retrievedPage.content.should.be.equal(newContent);
                done();
            });
        });
    });

    it("can delete a Page by id", function (done) {
        var newPage = { orgId: testOrgId, siteId: 1, name: '$Test - deleting this one', url: '#/delete', content: '#Delete' };
        pageService.create(newPage, function(err, page) {
            if (err) return done(err);

            pageService.delete(page.id, function(err) {
                if (err) return done(err);

                pageService.getById(page.id, function(err, retrievedPage) {
                    if (err) return done(err);

                    should.not.exist(retrievedPage);
                    done();
                });
            });
        });
    });

    it("has a unique index on siteId and url", function (done) {
        var newPage = { orgId: testOrgId, siteId: existingPage1.siteId, url: existingPage1.url, name: '$Test - I am a dupe',content: '#DUPE' };
        pageService.create(newPage, function(err, page) {
            if (err) return done();
            should.fail();
            done('did not prevent dupe');
        });
    });

    function deleteAllTestPages(next) {
        database.pages.remove({name: /^\$Test.*/, orgId: testOrgId}, function (err) {
            if(err) return next(err);

            next();
        });
    }
});

