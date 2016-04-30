"use strict";

var TemplateService = require('./templateService');
var database = require("../database/database");
var Promise = require("bluebird");
var testHelper = require("../common/testHelper");
var _ = require("lodash");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;

chai.use(chaiAsPromised);

var FakeTemplateRepo = function() {
    var templateRepo = {};

    var templateObjects = [];
    templateObjects.push({
        name: 'master',
        content: "<header>I'm the header</header>{{ content }}<footer>I'm the footer</footer>"
    });
    templateObjects.push({
        name: 'masterWithModel',
        title: 'Master Title',
        favoriteNumber: 11,
        content: "<header>I'm the header. {{title}}-{{favoriteNumber}}-{{favoriteColor}}</header>{{ content }}<footer>I'm the footer</footer>"
    });
    templateObjects.push({
        name: 'dog',
        content: "dogs are nice"
    });
    templateObjects.push({
        name: 'cat',
        content: "cats are ok"
    });
    templateObjects.push({
        name: 'chicken',
        content: "chickens are {{disposition}}"
    });

    templateRepo.getTemplate = function(templateName) {
        var templateObject = _.find(templateObjects, {name: templateName});
        return templateObject;
    };

    return templateRepo;
};

describe("TemplateService", function () {
    describe("CRUD", function () {
        let templateService = {};
        let existingTemplate1 = {};
        let existingTemplate2= {};
        let theUpdatedTemplate = {};
        let testOrgId = 1;
        let testSiteId = 1;

        before(() => {
            templateService = new TemplateService(database);
            // Insert some docs to be present before all tests start
            // All test data should belong to a specific orgId (a test org)
            var newTemplate1 = {
                orgId: testOrgId,
                siteId: testSiteId,
                name: "TestTemplate1",
                template: "test template one"
            };
            var newTemplate2 = {
                orgId: testOrgId,
                siteId: testSiteId,
                name: "TestTemplate2",
                template: "test template two"
            };

            return deleteAllTestTemplates()
                .then((result) => {
                    return database.templates.insert(newTemplate1);
                })
                .then((doc) => {
                    existingTemplate1 = doc;
                    existingTemplate1.id = existingTemplate1._id.toHexString();
                    return doc;
                })
                .then((result) => {
                    return database.templates.insert(newTemplate2);
                })
                .then((doc) => {
                    existingTemplate2 = doc;
                    existingTemplate2.id = existingTemplate2._id.toHexString();
                    return doc;
                })
                .then(null, (error) => {
                    console.log(error);
                    throw error;
                });
        });

        after(() => {
            // Remove all Test documents
            return deleteAllTestTemplates();
        });

        // todo: alter to enforce orgId (preferably in genericService). Add orgId to all service function parms, have controller pull orgId from auth mechanism.
        it("can get all templates", function () {
            let getAllPromise = templateService.getAll(testOrgId);

            return Promise.all([
                getAllPromise.should.eventually.be.instanceOf(Array),
                getAllPromise.should.eventually.have.length.greaterThan(1)
            ]);
        });

        it("can get templates by id", function () {
            let getById = templateService.getById(testOrgId, existingTemplate1.id);

            return getById.should.eventually.deep.equal(existingTemplate1);
        });

        it("can create templates", function () {
            let now = moment().format('hmmss');
            let testName = 'TestTemplate' + now;
            let myTemplate = {
                orgId: testOrgId,
                name: testName,
                site: testSiteId,
                template: "<h1>newly created template</h1>"
            };

            let createPromise = templateService.create(testOrgId, myTemplate);

            return createPromise
                .then((doc) => {
                    return templateService.getById(testOrgId, doc.id)
                        .then((retrievedDoc) => {
                            expect(retrievedDoc).to have property("site", testSiteId);
                            return expect(retrievedDoc).to.have.property("name", testName);
                        });
                });
            });
        });

        it("validates templates on create using extended validation - name and template", function () {
            let invalidTemplate = { // just needs to be missing some required properties
                orgId: testOrgId

            };

            let createPromise = templateService.create(testOrgId, invalidTemplate);

            return createPromise.should.be.rejectedWith(TypeError, "Need blah and whatever cheese");
        });

        it("can update templates by id", function () {
            let updatedTemplate = "updatedTemplate";
            let theUpdatedTemplate = {
                orgId: testOrgId,
                name: testName,
                siteId: createdSite,
                template = updatedTemplate
            };

            var updateByIdPromise = templateService.updateById(testOrgId, existingTemplate1.id, theUpdatedTemplate);

            return updateByIdPromise.then(function(numAffected) {
                numAffected.should.equal(1);

                // verify customSchema was updated
                var getByIdPromise = templateService.getById(testOrgId, existingTemplate1.id);

                return getByIdPromise.should.eventually.have.property("template").equal(updatedTemplate);
            });
        });

        it("can delete templates by id", function () {
            var newTemplate = {
                orgId: testOrgId,
                siteId: testSiteId,
                name: "testTemplate",
                template: "<h1>Delete Me</h1>"
            };

            var createPromise = templateService.create(testOrgId, newTemplate);

            return createPromise.then((doc) => {
                return templateService.deleteById(testOrgId, doc.id).then(function(result) {
                    return templateService.getById(testOrgId, doc.id).then(function(retrievedDoc) {
                        return expect(retrievedDoc).to.equal(null);
                    });
                });
            });
        });

        function deleteAllTestTemplates() {
            return database.templates.remove({orgId: testOrgId});
        }
    });

    describe("TemplateService Layouts", function () {
        var templateService = {};
        var engineType = 'liquid';

        before(function() {
            templateService = new TemplateService(database, new FakeTemplateRepo());
        });

        it("can render an object with content as the template and all other properties as the model", function () {
            var objectWithTemplate = {
                favoriteColor: 'blue',
                favoriteNumber: 22,
                content: '<h2>Favorite Color is {{favoriteColor}}, and Favorite Number is {{favoriteNumber}}</h2>'
            };
            return expect(templateService.renderObject(objectWithTemplate)).to.eventually.equal('<h2>Favorite Color is blue, and Favorite Number is 22</h2>');
        });

        it("can render using a layout", function () {
//        master template looks like this = "<header>I'm the header</header>{{ content }}<footer>I'm the footer</footer>";
            var objectWithTemplate = {
                favoriteColor: 'blue',
                favoriteNumber: 22,
                layout: 'master',
                content: '<h2>Favorite Color is {{favoriteColor}}, and Favorite Number is {{favoriteNumber}}</h2>'
            };
            return expect(templateService.renderObject(objectWithTemplate)).to.eventually.equal("<header>I'm the header</header><h2>Favorite Color is blue, and Favorite Number is 22</h2><footer>I'm the footer</footer>");
        });

        it("can use both content and layout template model properties in a layout template", function () {
            var objectWithTemplate = {
                favoriteColor: 'blue',
                layout: 'masterWithModel',
                content: '<h2>Some Content</h2>'
            };
            var expectedResult = "<header>I'm the header. Master Title-11-blue</header><h2>Some Content</h2><footer>I'm the footer</footer>";
            return expect(templateService.renderObject(objectWithTemplate)).to.eventually.equal(expectedResult);
        });

        it("can use both layout and content template model properties in a content template", function () {
            var objectWithTemplate = {
                favoriteColor: 'blue',
                layout: 'masterWithModel',
                content: '<h2>Some Content. {{title}}-{{favoriteNumber}}-{{favoriteColor}}</h2>'
            };
            var expectedResult = "<header>I'm the header. Master Title-11-blue</header><h2>Some Content. Master Title-11-blue</h2><footer>I'm the footer</footer>";
            return expect(templateService.renderObject(objectWithTemplate)).to.eventually.equal(expectedResult);
        });

        it("override layout model properties with content model properties with the same name", function () {
            var objectWithTemplate = {
                title: 'Content Title',
                favoriteNumber: '7',
                favoriteColor: 'yellow',
                layout: 'masterWithModel',
                content: '<h2>Some Content</h2>'
            };
            var expectedResult = "<header>I'm the header. Content Title-7-yellow</header><h2>Some Content</h2><footer>I'm the footer</footer>";
            return expect(templateService.renderObject(objectWithTemplate)).to.eventually.equal(expectedResult);
        });
    });

    describe("Front Matter", function () {
        var templateService = {};
        var engineType = 'liquid';

        before(function () {
            templateService = new TemplateService(database, new FakeTemplateRepo());
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

            var expectedModel = { color: 'blue', meat: 'beef' };
            var templateObject = templateService.convertStringToTemplateObject(templateString);
            templateObject.model.should.deep.equal(expectedModel);
            templateObject.template.should.deep.equal(expectedBody);
        });
    });

    describe("RQL Queries in Templates", function () {
        var templateService = {};
        var engineType = 'liquid';

        before(function () {
            templateService = new TemplateService(database, new FakeTemplateRepo());

            // Insert some docs to be present before all tests start
            return testHelper.setupTestProducts();
        });

        after(function () {
            // Remove everything we created
            return testHelper.deleteAllTestProducts();
        });

        it("can convert 'pure content' template strings with RQL queries in front matter into template objects", function () {
            var expectedBody = 'Template body is here';
            var expectedTitle = 'Products Over $10.00';
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
            var expectedBody = 'Template body is here';
            var expectedTitle = 'Products Over $10.00';
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

            var convertPromise = templateService.convertTemplateObjectQueriesToResultSets(templateObject);
            return Promise.all([
                convertPromise.should.eventually.have.property("model").deep.equal(expectedModel),
                convertPromise.should.eventually.have.property("template").deep.equal(expectedBody)
            ]);
        });
    });
});

