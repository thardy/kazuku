"use strict";
var DependencyService = require("./dependencyService");
var dependencyTestHelper = require("./dependencyTestHelper");
var Promise = require("bluebird");
var _ = require("lodash");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;
var moment = require("moment");
var sinon = require("sinon");

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

describe("DependencyService", function () {
    let dependencyService = {};
    let testOrgId = 1;
    let testContentType = 'testType';

    // These are unit tests, using fakes for customDataService, templateService, and queryService
    describe("getAllDependentsOfItem", function () {
        before(function () {

        });

        it("should get list of all items that need to be regenerated when a template changes", function () {
            // this needs to recursively get everything dependent on the item that changed
            // pass simple item object -> {type: 'data', name: 'products'}
            dependencyTestHelper.initMockDependencyChain();

            dependencyService = new DependencyService(dependencyTestHelper.fakeCustomDataService,
                                                      dependencyTestHelper.fakeTemplateService,
                                                      dependencyTestHelper.fakeQueryService);

            let changedItem = { type: "template", name: "header" };
            let expectedRegenerationList = [
                { type: "template", name: "master" },
                { type: "template", name: "christmasMaster" },
                { type: "page", name: "home" },
                { type: "page", name: "about" },
                { type: "page", name: "christmasHome" },
                { type: "page", name: "christmasAbout" }
            ];

            // An item changes - recursively get everything dependent on the item that changed
            let regenerationListPromise = dependencyService.getAllDependentsOfItem(dependencyTestHelper.testOrgId, changedItem);
            return regenerationListPromise
                .then((list) => {
                    expect(list).to.include.members(expectedRegenerationList);
                });
            //return regenerationListPromise.should.eventually.deep.include.members(expectedRegenerationList);
        });

        it("should get list of all items that need to be regenerated when a query changes", function () {
            dependencyTestHelper.initMockDependencyChain();

            dependencyService = new DependencyService(dependencyTestHelper.fakeCustomDataService,
                dependencyTestHelper.fakeTemplateService,
                dependencyTestHelper.fakeQueryService);

            let changedItem = { type: "query", name: "headerNavigation" };
            let expectedRegenerationList = [
                { type: "template", name: "header" },
                { type: "template", name: "master" },
                { type: "template", name: "christmasMaster" },
                { type: "page", name: "home" },
                { type: "page", name: "about" },
                { type: "page", name: "christmasHome" },
                { type: "page", name: "christmasAbout" }
            ];

            // An item changes - recursively get everything dependent on the item that changed
            let regenerationListPromise = dependencyService.getAllDependentsOfItem(dependencyTestHelper.testOrgId, changedItem);

            return regenerationListPromise.should.eventually.deep.include.members(expectedRegenerationList);
        });

        it("should get list of all items that need to be regenerated when data is added/updated/deleted", function () {
            dependencyTestHelper.initMockDependencyChain();

            dependencyService = new DependencyService(dependencyTestHelper.fakeCustomDataService,
                                                      dependencyTestHelper.fakeTemplateService,
                                                      dependencyTestHelper.fakeQueryService);

            let changedItem = { type: "data", name: "navItems" };
            let expectedRegenerationList = [
                { type: "query", name: "headerNavigation" },
                { type: "template", name: "header" },
                { type: "template", name: "master" },
                { type: "template", name: "christmasMaster" },
                { type: "page", name: "home" },
                { type: "page", name: "about" },
                { type: "page", name: "christmasHome" },
                { type: "page", name: "christmasAbout" }
            ];

            // An item changes - recursively get everything dependent on the item that changed
            let regenerationListPromise = dependencyService.getAllDependentsOfItem(dependencyTestHelper.testOrgId, changedItem);

            return regenerationListPromise.should.eventually.deep.include.members(expectedRegenerationList);
        });
    });

    describe("flagDependentItemsForRegeneration", () => {
        before(() => {

        });

        after(() => {

        });

        it("should set regenerate flag for all items in itemArray", () => {
            // itemArray is an array of objects with type and name - [{type: "data", name: "products"}, {type: "template, name: "header"}]
        });
    });

});

