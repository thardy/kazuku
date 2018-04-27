'use strict';
var CustomDataService = require('../customData/customDataService');
var TemplateService = require('../templates/templateService');
var QueryService = require('../queries/queryService');
let Database = require('../database/database').Database;
var sinon = require('sinon');
const testHelper = require('../common/testHelper');

const testOrgId = testHelper.testOrgId;
let testSiteId = 1;
let fakeNavItemsDataDependents = [
    { orgId: testOrgId, siteId: testSiteId, name: 'headerNavigation', nameId: 'header-navigation', query: 'blah'}
];
let fakeHeaderNavigationQueryDependents = [
    { orgId: testOrgId, siteId: testSiteId, name: 'header', nameId: 'header', template: 'blah', regenerate: 0 }
];
let fakeHeaderTemplateDependents = [
    { orgId: testOrgId, siteId: testSiteId, name: 'master', nameId: 'master', template: 'blah', regenerate: 0 },
    { orgId: testOrgId, siteId: testSiteId, name: 'christmasMaster', nameId: 'christmas-master', template: 'blah', regenerate: 0 }
];
let fakeMasterTemplateDependents = [
    { orgId: testOrgId, siteId: testSiteId, url: '/home', name: 'home', nameId: 'home', template: 'blah', regenerate: 0 },
    { orgId: testOrgId, siteId: testSiteId, url: '/about', name: 'about', nameId: 'about', template: 'blah', regenerate: 0 }
];
let fakeChristmasMasterTemplateDependents = [
    { orgId: testOrgId, siteId: testSiteId, url: '/home', name: 'christmasHome', nameId: 'christmas-home', template: 'blah', regenerate: 0 },
    { orgId: testOrgId, siteId: testSiteId, url: '/about', name: 'christmasAbout', nameId: 'christmas-about', template: 'blah', regenerate: 0 }
];

var dependencyTestHelper = {
    testOrgId: testOrgId,
    testSiteId: testSiteId,
    initMockDependencyChain: initMockDependencyChain,
    fakeDatabase: {},
    fakeNavItemsDataDependents: fakeNavItemsDataDependents,
    fakeHeaderNavigationQueryDependents: fakeHeaderNavigationQueryDependents,
    fakeHeaderTemplateDependents: fakeHeaderTemplateDependents,
    fakeMasterTemplateDependents: fakeMasterTemplateDependents,
    fakeChristmasMasterTemplateDependents: fakeChristmasMasterTemplateDependents
};

function initMockDependencyChain() {
    // Create a dependency chain, starting with data, then moving to all the other items that depend upon it
    let itemNavItemsData = {type:'data', nameId:'nav-items'};
    let itemHeaderNavigationQuery = {type: 'query', nameId: 'header-navigation'};
    let itemHeaderTemplate = {type:'template', nameId:'header'};
    let itemMasterTemplate = {type:'template', nameId:'master'};
    let itemChristmasMasterTemplate = {type:'template', nameId:'christmas-master'};


    let DatabaseStub = sinon.spy(function() {
        return sinon.createStubInstance(Database);
    });
    dependencyTestHelper.fakeDatabase = new DatabaseStub();
    dependencyTestHelper.fakeDatabase.queries = { find: function(queryObject) {
        return (JSON.stringify(queryObject) === JSON.stringify({orgId: dependencyTestHelper.testOrgId, dependencies: itemNavItemsData})) ? Promise.resolve(dependencyTestHelper.fakeNavItemsDataDependents) : Promise.resolve(null); }
    };
    dependencyTestHelper.fakeDatabase.templates = {
        find: function(queryObject) {
            if (JSON.stringify(queryObject) === JSON.stringify({orgId: dependencyTestHelper.testOrgId, dependencies: itemHeaderNavigationQuery}))
                return Promise.resolve(dependencyTestHelper.fakeHeaderNavigationQueryDependents);
            else if (JSON.stringify(queryObject) === JSON.stringify({orgId: dependencyTestHelper.testOrgId, dependencies: itemHeaderTemplate}))
                return Promise.resolve(dependencyTestHelper.fakeHeaderTemplateDependents);
            else if (JSON.stringify(queryObject) === JSON.stringify({orgId: dependencyTestHelper.testOrgId, dependencies: itemMasterTemplate}))
                return Promise.resolve(dependencyTestHelper.fakeMasterTemplateDependents);
            else if (JSON.stringify(queryObject) === JSON.stringify({orgId: dependencyTestHelper.testOrgId, dependencies: itemChristmasMasterTemplate}))
                return Promise.resolve(dependencyTestHelper.fakeChristmasMasterTemplateDependents);
            else
                return Promise.resolve(null);
        }
    };

    // todo: mock everything needed by dependencyService
    //this.db.queries.find({orgId: orgId, dependencies: item});
    //this.db.templates.find({orgId: orgId, dependencies:item})]);
    // dependencyTestHelper.fakeDatabase.queries.withArgs(sinon.match.any, itemNavItemsData).returns(fakeNavItemsDataDependents);
    // dependencyTestHelper.fakeDatabase.templates.withArgs(sinon.match.any, itemHeaderNavigationQuery, sinon.match.any).returns(fakeHeaderNavigationQueryDependents);
    // dependencyTestHelper.fakeDatabase.templates.withArgs(sinon.match.any, itemHeaderTemplate, sinon.match.any).returns(fakeHeaderTemplateDependents);
    // dependencyTestHelper.fakeDatabase.templates.withArgs(sinon.match.any, itemMasterTemplate, sinon.match.any).returns(fakeMasterTemplateDependents);
    // dependencyTestHelper.fakeDatabase.templates.withArgs(sinon.match.any, itemChristmasMasterTemplate, sinon.match.any).returns(fakeChristmasMasterTemplateDependents);

    // let CustomDataServiceStub = sinon.spy(function() {
    //     return sinon.createStubInstance(CustomDataService);
    // });
    // dependencyTestHelper.fakeCustomDataService = new CustomDataServiceStub();
    //
    // let QueryServiceStub = sinon.spy(function() {
    //     return sinon.createStubInstance(QueryService);
    // });
    // dependencyTestHelper.fakeQueryService = new QueryServiceStub();
    // dependencyTestHelper.fakeQueryService.getAllDependentsOfItem.withArgs(sinon.match.any, itemNavItemsData, sinon.match.any).returns(fakeNavItemsDataDependents);
    //
    // let TemplateServiceStub = sinon.spy(function() {
    //     return sinon.createStubInstance(TemplateService);
    // });
    // dependencyTestHelper.fakeTemplateService = new TemplateServiceStub();
    // dependencyTestHelper.fakeTemplateService.getAllDependentsOfItem.withArgs(sinon.match.any, itemHeaderNavigationQuery, sinon.match.any).returns(fakeHeaderNavigationQueryDependents);
    // dependencyTestHelper.fakeTemplateService.getAllDependentsOfItem.withArgs(sinon.match.any, itemHeaderTemplate, sinon.match.any).returns(fakeHeaderTemplateDependents);
    // dependencyTestHelper.fakeTemplateService.getAllDependentsOfItem.withArgs(sinon.match.any, itemMasterTemplate, sinon.match.any).returns(fakeMasterTemplateDependents);
    // dependencyTestHelper.fakeTemplateService.getAllDependentsOfItem.withArgs(sinon.match.any, itemChristmasMasterTemplate, sinon.match.any).returns(fakeChristmasMasterTemplateDependents);

}

module.exports = dependencyTestHelper;
