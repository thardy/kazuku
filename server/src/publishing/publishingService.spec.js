var PublishingService = require("./publishingService");
var Promise = require("bluebird");
var database = require("../database/database");
var _ = require("lodash");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;
var moment = require("moment");

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

describe("PublishingService", function () {

    it("can save pages to the file system");

    it("should delete pages when they need to be deleted");

    it("can publish an entire site on demand");

    it("regenerates items that need to be regenerated");

    it("creates page-per-item pages");

    it("creates multiple pages for templateObjects with PagedOn property");

    it("moves draft data to live collection when it is scheduled to go live");
    it("moves draft templates to live collection with they are scheduled to go live");
});