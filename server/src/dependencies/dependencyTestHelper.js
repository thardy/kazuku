"use strict";

var dependencyTestHelper = {
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
    let fakeMasterTemplateDependents = [{type:"template", name:"home"}, {type:"template", name:"about"}];
    let fakeChristmasMasterTemplateDependents = [{type:"template", name:"christmasHome"}, {type:"template", name:"christmasAbout"}]; // bad example, perhaps, but ok for testing

    let CustomDataServiceStub = sinon.spy(function() {
        return sinon.createStubInstance(CustomDataService);
    });
    dependencyTestHelper.fakeCustomDataService = new CustomDataServiceStub();

    let QueryServiceStub = sinon.spy(function() {
        return sinon.createStubInstance(QueryService);
    });
    dependencyTestHelper.fakeQueryService = new QueryServiceStub();
    fakeQueryService.getAllDependentsOfItem.withArgs(itemNavItemsData).returns(fakeNavItemsDataDependents);

    let TemplateServiceStub = sinon.spy(function() {
        return sinon.createStubInstance(TemplateService);
    });
    dependencyTestHelper.fakeTemplateService = new TemplateServiceStub();
    fakeTemplateService.getAllDependentsOfItem.withArgs(itemHeaderNavigationQuery).returns(fakeHeaderNavigationQueryDependents);
    fakeTemplateService.getAllDependentsOfItem.withArgs(itemHeaderTemplate).returns(fakeHeaderTemplateDependents);
    fakeTemplateService.getAllDependentsOfItem.withArgs(itemMasterTemplate).returns(fakeMasterTemplateDependents);
    fakeTemplateService.getAllDependentsOfItem.withArgs(itemChristmasMasterTemplate).returns(fakeChristmasMasterTemplateDependents);
}

module.exports = dependencyTestHelper;
