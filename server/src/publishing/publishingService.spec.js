"use strict";

var database = require("../database/database");
var PublishingService = require("./publishingService");
var QueryService = require("../queries/queryService");
var TemplateService = require("../templates/templateService");
var pubTestHelper = require("./publishingTestHelper");
var templateTestHelper = require("../templates/templateTestHelper");
var queryTestHelper = require("../queries/queryTestHelper");
var Promise = require("bluebird");
var _ = require("lodash");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

describe("PublishingService", function () {
    let publishingService = {};
    let queryService = {};
    let templateService = {};

    describe("regenerateItems", function () {
        before(function () {
            // need TemplateService to get list of all templates that need to be regenerated
            // need QueryService to get list of all queries that need to be regenerated
            // future: need CustomSchemaService to get list of all schemas setup for Page-per-item
            // future: need CustomDataService, to get list of all data to create Page-per-item pages
            //  and to get data for templates with PagedOn property (create pages for resultset)
            // need some sort of FileService, to save and delete files

            publishingService = new PublishingService(database);
            queryService = new QueryService(database);
            templateService = new TemplateService(database);
        });

        it("regenerates items on a schedule");

        it("regenerates all items that need to be regenerated", function () {
            // Create all our test data
            return pubTestHelper.createCustomData()
                .then((result) => {
                    return pubTestHelper.createQueryRegenerateList();
                })
                .then((result) => {
                    return pubTestHelper.createTemplatesForRegenerationTests();
                })
                .then((result) => {
                    return pubTestHelper.createPageRegenerateList();
                })
                .then((result) => {
                    // Call regenerateItems
                    return publishingService.regenerateItems(pubTestHelper.testOrgId, pubTestHelper.testSiteId);
                })
                .then((result) => {
                    // Verify query results
                    let nameArray = [];
                    for (var expectedQuery of pubTestHelper.expectedRenderedQueries) {
                        nameArray.push(expectedQuery[0]);
                    }

                    let mongoQueryObject = { "name": { "$in": nameArray }};

                    // retrieve all the queries that we were supposed to regenerate
                    return queryService.find(pubTestHelper.testOrgId, mongoQueryObject)
                        .then((retrievedQueries) => {
                            for (let query of retrievedQueries) {
                                let expected = pubTestHelper.expectedRenderedQueries.get(query.name);
                                // compare their results to expected results
                                query.results.should.deep.equal(expected);
                                // verify regenerate properties were reset to zero
                                query.regenerate.should.equal(0);
                            }
                            return retrievedQueries;
                        })
                        .then(null, e => {
                            throw e;
                        });
                })
                .then((result) => {
                    // Verify page rendered outputs
                    let nameArray = [];
                    for (let expectedTemplate of pubTestHelper.expectedRenderedPages) {
                        nameArray.push(expectedTemplate[0]);
                    }

                    let mongoQueryObject = { "name": { "$in": nameArray }};

                    // retrieve all the pages we were supposed to regenerate
                    return templateService.find(pubTestHelper.testOrgId, mongoQueryObject)
                        .then((retrievedTemplates) => {
                            for (var template of retrievedTemplates) {
                                let expected = pubTestHelper.expectedRenderedPages.get(template.name);
                                expect(template.renderedTemplate).to.deep.equal(expected);
                                // verify regenerate properties were reset to zero
                                template.regenerate.should.equal(0);
                            }
                            return retrievedTemplates;
                        })
                        .then(null, e => {
                            throw e;
                        });

                        // todo: for pages, also compare expected outputs to file outputs OR relegate this to a separate test
                });
        });

        it("regenerates templates");

        it("regenerates queries");

        it("regenerates pages");

        it("saves pages to the file system when they are regenerated");
    });

    describe("Scheduling", function () {
        it("moves draft customData to live when scheduled");
        it("moves draft templates to live when scheduled");

    });
    

    it("can publish an entire site on demand");

    it("creates page-per-item pages");

    it("creates multiple pages for templateObjects with PagedOn property");

    it("should delete pages when they need to be deleted");

    it("moves draft data to live collection when it is scheduled to go live");
    it("moves draft templates to live collection when they are scheduled to go live");
});