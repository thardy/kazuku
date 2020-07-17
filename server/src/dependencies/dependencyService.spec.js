'use strict';
import DependencyService from './dependencyService.js';
import dependencyTestHelper from './dependencyTestHelper.js';
import Promise from 'bluebird';
import _ from 'lodash';
import chai from 'chai';
const should = chai.Should();
const expect = chai.expect;
import moment from 'moment';
import sinon from 'sinon';

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import chaiThings from 'chai-things';
chai.use(chaiThings);


describe("DependencyService", function () {
    let dependencyService = {};
    let testContentType = 'testType';

    // These are unit tests, using fakes for customDataService, templateService, and queryService
    describe("getAllDependentsOfItem", function () {
        before(function () {

        });

        it("should get list of all items that need to be regenerated when a template changes", function () {
            // this needs to recursively get everything dependent on the item that changed
            // pass simple item object -> {type: 'data', name: 'products'}
            dependencyTestHelper.initMockDependencyChain();

            dependencyService = new DependencyService(dependencyTestHelper.fakeDatabase);

            let changedItem = { type: "template", nameId: "header" };
            let expectedRegenerationList = dependencyTestHelper.fakeHeaderTemplateDependents
                .concat(dependencyTestHelper.fakeMasterTemplateDependents)
                .concat(dependencyTestHelper.fakeChristmasMasterTemplateDependents);

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

            dependencyService = new DependencyService(dependencyTestHelper.fakeDatabase);

            let changedItem = { type: "query", nameId: "header_navigation" };
            let expectedRegenerationList = dependencyTestHelper.fakeHeaderNavigationQueryDependents
                .concat(dependencyTestHelper.fakeHeaderTemplateDependents)
                .concat(dependencyTestHelper.fakeMasterTemplateDependents)
                .concat(dependencyTestHelper.fakeChristmasMasterTemplateDependents);

            // An item changes - recursively get everything dependent on the item that changed
            let regenerationListPromise = dependencyService.getAllDependentsOfItem(dependencyTestHelper.testOrgId, changedItem);

            return regenerationListPromise.should.eventually.deep.include.members(expectedRegenerationList);
        });

        it("should get list of all items that need to be regenerated when data is added/updated/deleted", function () {
            dependencyTestHelper.initMockDependencyChain();

            dependencyService = new DependencyService(dependencyTestHelper.fakeDatabase);

            let changedItem = { type: "data", nameId: "nav_items" };
            let expectedRegenerationList = dependencyTestHelper.fakeNavItemsDataDependents
                .concat(dependencyTestHelper.fakeHeaderNavigationQueryDependents)
                .concat(dependencyTestHelper.fakeHeaderTemplateDependents)
                .concat(dependencyTestHelper.fakeMasterTemplateDependents)
                .concat(dependencyTestHelper.fakeChristmasMasterTemplateDependents);

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

