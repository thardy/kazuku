"use strict";

var TemplateService = require("./templateService");
var templateTestHelper = require("./templateTestHelper");
var database = require("../database/database").database;
var Promise = require("bluebird");
var testHelper = require("../common/testHelper");
var _ = require("lodash");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.Should();
var expect = chai.expect;
var moment = require("moment");

chai.use(chaiAsPromised);

var FakeTemplateRepo = function() {
    var templateRepo = {};

    var templateObjects = [];
    templateObjects.push({
        orgId: 1,
        name: "master",
        template: "<header>I'm the header</header>{{ content }}<footer>I'm the footer</footer>"
    });
    templateObjects.push({
        orgId: 1,
        name: "masterWithModel",
        title: "Master Title",
        favoriteNumber: 11,
        template: "<header>I'm the header. {{title}}-{{favoriteNumber}}-{{favoriteColor}}</header>{{ content }}<footer>I'm the footer</footer>"
    });
    templateObjects.push({
        orgId: 1,
        name: "dog",
        template: "dogs are nice"
    });
    templateObjects.push({
        orgId: 1,
        name: "cat",
        template: "cats are ok"
    });
    templateObjects.push({
        orgId: 1,
        name: "chicken",
        template: "chickens are {{disposition}}"
    });

    // getTemplate returns a templateObject
    templateRepo.getTemplate = function(orgId, templateName) {
        var resolver = Promise.defer();
        var foundTemplateObject = _.find(templateObjects, {orgId: orgId, name: templateName});
        setTimeout(function () {
            resolver.resolve(foundTemplateObject);
        }, 100);
        return resolver.promise;
    };

    return templateRepo;
};

describe("TemplateService", function () {
    describe("CRUD", function () {
        let templateService = {};

        before(() => {
            templateService = new TemplateService(database);
            // Insert some docs to be present before all tests start
            // All test data should belong to a specific orgId (a test org)
            return templateTestHelper.createTemplateList();
        });

        after(() => {
            // Remove all Test documents
            return templateTestHelper.deleteAllTestTemplates();
        });

        // todo: alter to enforce orgId (preferably in genericService). Add orgId to all service function parms, have controller pull orgId from auth mechanism.
        it("can get all templates", function () {
            let getAllPromise = templateService.getAll(templateTestHelper.testOrgId);

            return Promise.all([
                getAllPromise.should.eventually.be.instanceOf(Array),
                getAllPromise.should.eventually.have.length.greaterThan(1)
            ]);
        });

        it("can get templates by id", function () {
            let getById = templateService.getById(templateTestHelper.testOrgId, templateTestHelper.existingTemplate1.id);

            return getById.should.eventually.deep.equal(templateTestHelper.existingTemplate1);
        });

        it("can get all templates that need to be regenerated", function () {
            return templateTestHelper.createRegenerateList()
                .then(function (result) {
                    let regeneratePromise = templateService.getRegenerateList(templateTestHelper.testOrgId);

                    //return regeneratePromise.should.eventually.deep.include.members(templateTestHelper.existingRegenerateList);
                    return regeneratePromise
                        .then((templates) => {
                            return expect(templates).to.deep.include.members(templateTestHelper.existingRegenerateList);
                        });
                });
        });

        it("can create templates", function () {
            let now = moment().format("hmmss");
            let testName = "TestTemplate" + now;
            let myTemplate = {
                orgId: templateTestHelper.testOrgId,
                name: testName,
                site: templateTestHelper.testSiteId,
                template: "<h1>newly created template</h1>"
            };

            let createPromise = templateService.create(templateTestHelper.testOrgId, myTemplate);

            return createPromise
                .then((doc) => {
                    return templateService.getById(templateTestHelper.testOrgId, doc.id)
                        .then((retrievedDoc) => {
                            expect(retrievedDoc).to.have.property("organization", templateTestHelper.testSiteId);
                            return expect(retrievedDoc).to.have.property("name", testName);
                        });
                });

        });

        it("validates templates on create using extended validation - name and template", function () {
            let invalidTemplate = { // just needs to be missing some required properties
                orgId: templateTestHelper.testOrgId,
                siteId: templateTestHelper.testSiteId,
                name: "testTemplateName"
                // template property is missing
            };

            let createPromise = templateService.create(templateTestHelper.testOrgId, invalidTemplate);

            return createPromise.should.be.rejectedWith(TypeError, "Need name and template");
        });

        it("can update templates by id", function () {
            let updatedTemplate = "updatedTemplate";
            let theUpdatedTemplate = {
                orgId: templateTestHelper.testOrgId,
                name: "testName",
                siteId: templateTestHelper.testSiteId,
                template: updatedTemplate
            };

            var updateByIdPromise = templateService.updateById(templateTestHelper.testOrgId, templateTestHelper.existingTemplate1.id, theUpdatedTemplate);

            return updateByIdPromise.then(function(result) {
                result.nModified.should.equal(1);

                // verify customSchema was updated
                var getByIdPromise = templateService.getById(templateTestHelper.testOrgId, templateTestHelper.existingTemplate1.id);

                return getByIdPromise.should.eventually.have.property("template").equal(updatedTemplate);
            });
        });

        it("can delete templates by id", function () {
            var newTemplate = {
                orgId: templateTestHelper.testOrgId,
                siteId: templateTestHelper.testSiteId,
                name: "testTemplate",
                template: "<h1>Delete Me</h1>"
            };

            var createPromise = templateService.create(templateTestHelper.testOrgId, newTemplate);

            return createPromise.then((doc) => {
                return templateService.delete(templateTestHelper.testOrgId, doc.id).then(function(result) {
                    return templateService.getById(templateTestHelper.testOrgId, doc.id).then(function(retrievedDoc) {
                        return expect(retrievedDoc).to.equal(null);
                    });
                });
            });
        });

        it("getAllDependentsOfItem with template item returns item array of dependent templates", function () {
            let item = {type: "template", name: "NewTemplateHeader"};
            let expectedDependents = [
                {type: "template", name: "NewTemplateWithIncludes"},
                {type: "template", name: "NewAnotherTemplateWithInclude"},
                {type: "page", name: "NewTemplateThatIsPage"},
            ];
            let promise = templateService.getAllDependentsOfItem(templateTestHelper.testOrgId, item);

            return promise.should.eventually.deep.include.members(expectedDependents);
        });

        it("getAllDependentsOfItem with query item returns item array of dependent templates", function () {
            let item = {type: "query", name: "someQuery"};
            let expectedDependents = [
                {type: "page", name: "NewTemplateThatIsPage"}
            ];
            let promise = templateService.getAllDependentsOfItem(templateTestHelper.testOrgId, item);

            return promise.should.eventually.deep.include.members(expectedDependents);
        });

        it("can save dependencies on create", function () {
            let testName = "TestTemplateWithDependencies";
            let myTemplate = {
                orgId: templateTestHelper.testOrgId,
                url: "somePage",
                name: testName,
                site: templateTestHelper.testSiteId,
                products: "query(top5Products)",
                testimonials: `eq(contentType,testimonials)&sort(created)`,
                template: "{% include 'header' %}<h1>newly created template</h1>{% include 'footer' %}"
            };
            let expectedDependencies = [
                {type: "query", name: "top5Products"},
                {type: "data", name: "testimonials"},
                {type: "template", name: "header"},
                {type: "template", name: "footer"}
            ];

            let createPromise = templateService.create(templateTestHelper.testOrgId, myTemplate);

            return createPromise
                .then((doc) => {
                    return templateService.getById(templateTestHelper.testOrgId, doc.id)
                        .then((retrievedDoc) => {
                            retrievedDoc.organization.should.equal(templateTestHelper.testSiteId);
                            retrievedDoc.name.should.equal(testName);
                            return retrievedDoc.dependencies.should.deep.include.members(expectedDependencies);
                        });
                });
        });

        it("can save dependencies on update", function () {
            let theUpdatedTemplate = {
                orgId: templateTestHelper.testOrgId,
                url: "somePage",
                name: "updatedTemplateWithDependencies",
                site: templateTestHelper.testSiteId,
                widgets: `eq(contentType,widgets)&sort(created)`,
                template: "<h1>newly created template</h1>{% include 'footer' %}"
            };
            let expectedDependencies = [
                {type: "data", name: "widgets"},
                {type: "template", name: "footer"}
            ];

            var updateByIdPromise = templateService.updateById(templateTestHelper.testOrgId, templateTestHelper.existingTemplate1.id, theUpdatedTemplate);

            return updateByIdPromise
                .then((result) => {
                    result.nModified.should.equal(1);

                    // verify dependencies value
                    var getByIdPromise = templateService.getById(templateTestHelper.testOrgId, templateTestHelper.existingTemplate1.id);

                    return getByIdPromise.should.eventually.have.property("dependencies").deep.include.members(expectedDependencies);
                });
        });
    });

    describe("Dependencies", function() {
        let templateService = {};

        before(() => {
            templateService = new TemplateService(database);
        });

        after(() => {});

        describe("getDependenciesOfTemplate", function () {
            it("should return all dependencies of a template", function () {
                let expectedDependencies =  [ { type: 'template', name: 'master' }, { type: 'query', name: 'top5Products' } ];
                let template = {
                    orgId: templateTestHelper.testOrgId,
                    siteId: 1,
                    url: "home",
                    layout: "master",
                    products: "query(top5Products)",
                    template: "template body is here"
                };

                let dependencies = templateService.getDependenciesOfTemplate(template);

                dependencies.should.have.length(2);
                dependencies.should.deep.include.members(expectedDependencies);

            });

            it("should return all dependencies of a template with includes", function () {
                let expectedDependencies =  [
                    { type: "template", name: "master" },
                    { type: "query", name: "top10Events" },
                    { type: "template", name: "header" },
                    { type: "template", name: "footer" }
                ];
                let template = {
                    orgId: templateTestHelper.testOrgId,
                    siteId: 1,
                    url: "home",
                    layout: "master",
                    products: "query(top10Events)",
                    template: "{% include 'header' %}<div>template body is here</div>{% include 'footer' %}"
                };

                let dependencies = templateService.getDependenciesOfTemplate(template);

                dependencies.should.have.length(4);
                dependencies.should.deep.include.members(expectedDependencies);
            });
        });
    });

    describe("TemplateService Unit Layouts", function () {
        var templateService = {};
        var engineType = "liquid";
        var fakeTemplateRepo = new FakeTemplateRepo();

        before(function() {
            templateService = new TemplateService(database, null, fakeTemplateRepo.getTemplate.bind(fakeTemplateRepo));
        });

        it("can render an object with content as the template and all other properties as the model", function () {
            // "An object" can simply be a customData object, basically any json object can simply add a content property
            //  and, optionally, a layout property to have it's content rendered as a template
            var objectWithTemplate = {
                favoriteColor: "blue",
                favoriteNumber: 22,
                template: "<h2>Favorite Color is {{favoriteColor}}, and Favorite Number is {{favoriteNumber}}</h2>"
            };
            return expect(templateService.renderObject(templateTestHelper.testOrgId, objectWithTemplate)).to.eventually.equal("<h2>Favorite Color is blue, and Favorite Number is 22</h2>");
        });

        it("can render using a layout", function () {
//        master template looks like this = "<header>I'm the header</header>{{ content }}<footer>I'm the footer</footer>";
            var objectWithTemplate = {
                favoriteColor: "blue",
                favoriteNumber: 22,
                layout: "master",
                template: "<h2>Favorite Color is {{favoriteColor}}, and Favorite Number is {{favoriteNumber}}</h2>"
            };
            return expect(templateService.renderObject(templateTestHelper.testOrgId, objectWithTemplate)).to.eventually.equal("<header>I'm the header</header><h2>Favorite Color is blue, and Favorite Number is 22</h2><footer>I'm the footer</footer>");
        });

        it("can use both content and layout template model properties in a layout template", function () {
            var objectWithTemplate = {
                favoriteColor: "blue",
                layout: "masterWithModel",
                template: "<h2>Some Content</h2>"
            };
            var expectedResult = "<header>I'm the header. Master Title-11-blue</header><h2>Some Content</h2><footer>I'm the footer</footer>";
            return expect(templateService.renderObject(templateTestHelper.testOrgId, objectWithTemplate)).to.eventually.equal(expectedResult);
        });

        it("can use both layout and content template model properties in a content template", function () {
            var objectWithTemplate = {
                favoriteColor: "blue",
                layout: "masterWithModel",
                template: "<h2>Some Content. {{title}}-{{favoriteNumber}}-{{favoriteColor}}</h2>"
            };
            var expectedResult = "<header>I'm the header. Master Title-11-blue</header><h2>Some Content. Master Title-11-blue</h2><footer>I'm the footer</footer>";
            return expect(templateService.renderObject(templateTestHelper.testOrgId, objectWithTemplate)).to.eventually.equal(expectedResult);
        });

        it("override layout model properties with content model properties with the same name", function () {
            var objectWithTemplate = {
                title: "Content Title",
                favoriteNumber: "7",
                favoriteColor: "yellow",
                layout: "masterWithModel",
                template: "<h2>Some Content</h2>"
            };
            var expectedResult = "<header>I'm the header. Content Title-7-yellow</header><h2>Some Content</h2><footer>I'm the footer</footer>";
            return expect(templateService.renderObject(templateTestHelper.testOrgId, objectWithTemplate)).to.eventually.equal(expectedResult);
        });
    });

    describe("TemplateService Integration Layouts", function () {
        var templateService = {};

        before(function() {
            templateService = new TemplateService(database);
            return templateTestHelper.createTemplateList();
        });

        after(() => {
            // Remove all Test documents
            return templateTestHelper.deleteAllTestTemplates();
        });

        it("can render using a layout", function () {
            let expected = templateTestHelper.expectedRenderedTemplates.get("NewTemplateWithLayout");

            return templateService.getTemplate(templateTestHelper.testOrgId, "NewTemplateWithLayout")
                .then((templateObject) => {
                    return expect(templateService.renderObject(templateTestHelper.testOrgId, templateObject)).to.eventually.equal(expected);
                });
        });

        it("can render includes when include has a model", function () {
            let expected = templateTestHelper.expectedRenderedTemplates.get("NewTemplateWithIncludes");

            return templateService.getTemplate(templateTestHelper.testOrgId, "NewTemplateWithIncludes")
                .then((templateObject) => {
                    return expect(templateService.renderObject(templateTestHelper.testOrgId, templateObject)).to.eventually.equal(expected);
                });
        });
    });

    describe("Front Matter", function () {
        var templateService = {};
        var engineType = "liquid";
        var fakeTemplateRepo = new FakeTemplateRepo();

        before(function () {
            templateService = new TemplateService(database, null, fakeTemplateRepo.getTemplate.bind(fakeTemplateRepo));
        });

        after(function () {
        });

        it("can convert template strings without front matter into template objects", function () {
            var expectedBody = "Template body is here";
            var templateString = expectedBody;

            var expectedModel = {};
            var templateObject = templateService.convertStringToTemplateObject(templateString);
            templateObject.model.should.deep.equal(expectedModel);
            templateObject.template.should.deep.equal(expectedBody);
        });

        // Need to convert front matter into properties and create a template object containing those properties as well as a
        //  content property with the template in it.
        it("can convert 'pure content' template strings with simple front matter into template objects", function () {
            var expectedBody = "Template body is here";
            var templateString =
                "---\n" +
                "color: 'blue'\n" +
                "meat: 'beef'\n" +
                "---\n" +
                expectedBody;

            var expectedModel = { color: "blue", meat: "beef" };
            var templateObject = templateService.convertStringToTemplateObject(templateString);
            templateObject.model.should.deep.equal(expectedModel);
            templateObject.template.should.deep.equal(expectedBody);
        });
    });

    describe("RQL Queries in Templates", function () {
        var templateService = {};
        var engineType = "liquid";
        var fakeTemplateRepo = new FakeTemplateRepo();

        before(function () {
            templateService = new TemplateService(database, null, fakeTemplateRepo.getTemplate.bind(fakeTemplateRepo));

            // Insert some docs to be present before all tests start
            return testHelper.setupTestProducts();
        });

        after(function () {
            // Remove everything we created
            return testHelper.deleteAllTestProducts();
        });

        it("can convert 'pure content' template strings with RQL queries in front matter into template objects", function () {
            var expectedBody = "Template body is here";
            var expectedTitle = "Products Over $10.00";
            var productQuery = "contentType={0}&price=gt=10.1&sort(price)".format(testHelper.testProductsContentType);
            var templateString =
                "---\n" +
                "products: {0}\n".format(productQuery) +
                "title: {0}\n".format(expectedTitle) +
                "---\n" +
                expectedBody;

            var expectedModel = {
                products: productQuery,
                title: expectedTitle
            };
            var templateObject = templateService.convertStringToTemplateObject(templateString);
            templateObject.model.should.deep.equal(expectedModel);
            templateObject.template.should.deep.equal(expectedBody);
        });

        // same as above but queries not defined in front matter, but in the content object itself
        it("can have model property RQL queries in template objects converted to resultsets", function () {
            var expectedBody = "Template body is here";
            var expectedTitle = "Products Over $10.00";
            var productQuery = "contentType={0}&price=gt=10.1&sort(price)".format(testHelper.testProductsContentType);
            var templateObject = {
                model: {
                    products: productQuery,
                    title: expectedTitle
                },
                template: expectedBody
            };
            var expectedModel = {
                products: [
                    testHelper.newProduct3,
                    testHelper.newProduct2
                ],
                title: expectedTitle
            };

            var convertPromise = templateService.convertTemplateObjectQueriesToResultSets(templateTestHelper.testOrgId, templateObject);
            // ??? - I think this is a misuse of Promise.all
            return Promise.all([
                convertPromise.should.eventually.have.property("model").deep.equal(expectedModel),
                convertPromise.should.eventually.have.property("template").deep.equal(expectedBody)
            ]);
        });
    });
});

