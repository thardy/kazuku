"use strict";
var CustomDataService = require("../customData/customDataService");
var TemplateService = require("../templates/templateService");
var QueryService = require("../queries/queryService");
var sinon = require("sinon");

var dependencyTestHelper = {
    testOrgId: 1,
    initDependencyChain: initDependencyChain,
    fakeCustomDataService: {},
    fakeQueryService: {},
    fakeTemplateService: {}
};

function initDependencyChain() {
    // Create a dependency chain, starting with data, then moving to all the other items that depend upon it
    let itemNavItemsData = {type:'data', name:'navItems'};
    let itemHeaderNavigationQuery = {type: "query", name: "headerNavigation"};
    let itemHeaderTemplate = {type:"template", name:"header"};
    let itemMasterTemplate = {type:"template", name:"master"};
    let itemChristmasMasterTemplate = {type:"template", name:"christmasMaster"};

    let fakeNavItemsDataDependents = [itemHeaderNavigationQuery];
    let fakeHeaderNavigationQueryDependents = [itemHeaderTemplate];
    let fakeHeaderTemplateDependents = [itemMasterTemplate, itemChristmasMasterTemplate];
    let fakeMasterTemplateDependents = [{type:"page", name:"home"}, {type:"page", name:"about"}];
    let fakeChristmasMasterTemplateDependents = [{type:"page", name:"christmasHome"}, {type:"page", name:"christmasAbout"}]; // bad example, perhaps, but ok for testing

    let CustomDataServiceStub = sinon.spy(function() {
        return sinon.createStubInstance(CustomDataService);
    });
    dependencyTestHelper.fakeCustomDataService = new CustomDataServiceStub();

    let QueryServiceStub = sinon.spy(function() {
        return sinon.createStubInstance(QueryService);
    });
    dependencyTestHelper.fakeQueryService = new QueryServiceStub();
    dependencyTestHelper.fakeQueryService.getAllDependentsOfItem.withArgs(sinon.match.any, itemNavItemsData, sinon.match.any).returns(fakeNavItemsDataDependents);

    let TemplateServiceStub = sinon.spy(function() {
        return sinon.createStubInstance(TemplateService);
    });
    dependencyTestHelper.fakeTemplateService = new TemplateServiceStub();
    dependencyTestHelper.fakeTemplateService.getAllDependentsOfItem.withArgs(sinon.match.any, itemHeaderNavigationQuery, sinon.match.any).returns(fakeHeaderNavigationQueryDependents);
    dependencyTestHelper.fakeTemplateService.getAllDependentsOfItem.withArgs(sinon.match.any, itemHeaderTemplate, sinon.match.any).returns(fakeHeaderTemplateDependents);
    dependencyTestHelper.fakeTemplateService.getAllDependentsOfItem.withArgs(sinon.match.any, itemMasterTemplate, sinon.match.any).returns(fakeMasterTemplateDependents);
    dependencyTestHelper.fakeTemplateService.getAllDependentsOfItem.withArgs(sinon.match.any, itemChristmasMasterTemplate, sinon.match.any).returns(fakeChristmasMasterTemplateDependents);

}

module.exports = dependencyTestHelper;
