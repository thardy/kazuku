"use strict";
var CustomDataService = require("../customData/customDataService");
var TemplateService = require("../templates/templateService");
var QueryService = require("../queries/queryService");
var CustomSchemaService = require("../customSchemas/customSchemaService");
var sinon = require("sinon");

var publishingTestHelper = {
    initDependencyChain: initDependencyChain,
    fakeCustomDataService: {},
    fakeCustomSchemaService: {},
    fakeQueryService: {},
    fakeTemplateService: {},
    fakeFileService: {}
};

function setupItemsToBeRegenerated() {

    // Create queries to be regenerated

    // Create templates to be regenerated


}

module.exports = publishingTestHelper;

