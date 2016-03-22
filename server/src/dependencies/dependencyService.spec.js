"use strict";
var DependencyService = require("./dependencyService");
var Promise = require("bluebird");
var database = require("../database/database");
var _ = require("lodash");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;
var moment = require("moment");

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

describe("DependencyService", function () {
    let dependencyService = {};
    let testOrgId = 1;
    let testContentType = 'testType';

    before(function () {
        // todo: fake the database.  Let's make these unit tests, not integration tests.
        dependencyService = new DependencyService(database);
    });

    describe("getDependenciesOf", function () {
        it("should return all dependencies of a template", function () {
            let expectedDependencies =  [ { type: 'template', name: 'master' }, { type: 'query', name: 'top5Products' } ];
            let template = {
                orgId: testOrgId,
                siteId: 1,
                url: 'home',
                layout: 'master',
                products:'query(top5Products)',
                template: 'template body is here'
            };

            let dependencies = dependencyService.getDependenciesOf(template);

            dependencies.should.have.length(2);
            dependencies.should.deep.equal(expectedDependencies);

        });

        it("should return all dependencies of a template with includes", function () {
            let expectedDependencies =  [
                { type: 'template', name: 'master' },
                { type: 'query', name: 'top10Events' },
                { type: 'template', name: 'header' },
                { type: 'template', name: 'footer' }
            ];
            let template = {
                orgId: testOrgId,
                siteId: 1,
                url: 'home',
                layout: 'master',
                products:'query(top10Events)',
                template: '{% include header %}<div>template body is here</div>{% include footer %}'
            };

            let dependencies = dependencyService.getDependenciesOf(template);

            dependencies.should.have.length(4);
            dependencies.should.deep.equal(expectedDependencies);

        });

        it("should return all dependencies of a query", function () {
            let expectedDependencies = [{type: 'data', name: 'products'}];
            let query = {
                orgId: testOrgId,
                siteId: 1,
                name: 'top5Products',
                query: 'eq(contentType, products)&limit(5)$sort(created)'
            };

            let dependencies = dependencyService.getDependenciesOf(query);

            dependencies.should.have.length(1);
            dependencies.should.deep.equal(expectedDependencies);
        });
    });



    describe("getRegenerationListFor", function () {
        it("should get list of all items that need to be regenerated when a template changes", function () {
            // this needs to recursively get everything dependent on the item that changed
            // pass simple item object -> {type: 'data', name: 'products'}

        });

        it("should get list of all items that need to be regenerated when a query changes");

        it("should get list of all items that need to be regenerated when data is added/updated/deleted", function () {
            // navItems are added or deleted
            let expectedRegenerationList = [
                { type: "query", name: "headerNavigation" },
                { type: "template", name: "header" },
                { type: "template", name: "master" },
                { type: "template", name: "home" },
                { type: "template", name: "about" },
            ];
            let changedItem = { type: "data", name: "navItems" };

            let regenerationList = dependencyService.getRegenerationListFor(changedItem);

            regenerationList.should.have.length(5);
            regenerationList.should.deep.equal(expectedRegenerationList);
        });
    });

    describe("FlagItemsForRegeneration", function () {
        it("should flag all items in list for regeneration", function () {
            // this should set the regenerate flag to true on all the items in the list.
            // the ApiTest for this will be more compelling, making sure every document in the list gets the flag set in Mongo
        });
    });

});

