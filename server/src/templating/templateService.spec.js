var TemplateService = require('./templateService');
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
    describe("TemplateService Layouts", function () {
        var templateService = {};
        var engineType = 'liquid';

        before(function() {
            templateService = new TemplateService({templateRepo: new FakeTemplateRepo()});
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
            templateService = new TemplateService({templateRepo: new FakeTemplateRepo()});
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
            templateService = new TemplateService({templateRepo: new FakeTemplateRepo()});

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

