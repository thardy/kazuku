"use strict";

var PublishingService = require("./publishingService");
var publishingTestHelper = require("./publishingTestHelper");
var Promise = require("bluebird");
var _ = require("lodash");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

describe("PublishingService", function () {
    let publishingService = {};
    let testOrgId = 1;
    let testSiteId = 1;

    describe("regenerateItems", function () {
        before(function () {
            // need TemplateService to get list of all templates that need to be regenerated
            // need QueryService to get list of all queries that need to be regenerated
            // future: need CustomSchemaService to get list of all schemas setup for Page-per-item
            // future: need CustomDataService, to get list of all data to create Page-per-item pages
            //  and to get data for templates with PagedOn property (create pages for resultset)
            // need some sort of FileService, to save and delete files

            // todo: we're ready to write this test now
            publishingService = new PublishingService();

        });

        it("regenerates items on a schedule");

        it("regenerates all items that need to be regenerated", function () {
            // todo: setup some items to be regenerated
            // todo: store what the regenerated outputs should look like

            // Call regenerateItems
            //publishingService.regenerateItems(testOrgId, testSiteId);

            // Verify outputs
        });

        it("regenerates templates");

        it("regenerates queries");

        it("regenerates pages");

        it("saves pages to the file system when they are regenerated");
    });
    

    it("can publish an entire site on demand");

    it("creates page-per-item pages");

    it("creates multiple pages for templateObjects with PagedOn property");

    it("should delete pages when they need to be deleted");

    it("moves draft data to live collection when it is scheduled to go live");
    it("moves draft templates to live collection when they are scheduled to go live");
});