var TemplateService = require('./templateService');
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
        return expect(templateService.RenderObject(objectWithTemplate)).to.eventually.equal('<h2>Favorite Color is blue, and Favorite Number is 22</h2>');
    });

    it("can render using a layout", function () {
//        master template looks like this = "<header>I'm the header</header>{{ content }}<footer>I'm the footer</footer>";
        var objectWithTemplate = {
            favoriteColor: 'blue',
            favoriteNumber: 22,
            layout: 'master',
            content: '<h2>Favorite Color is {{favoriteColor}}, and Favorite Number is {{favoriteNumber}}</h2>'
        };
        return expect(templateService.RenderObject(objectWithTemplate)).to.eventually.equal("<header>I'm the header</header><h2>Favorite Color is blue, and Favorite Number is 22</h2><footer>I'm the footer</footer>");
    });

    it("can use both content and layout template model properties in a layout template", function () {
        var objectWithTemplate = {
            favoriteColor: 'blue',
            layout: 'masterWithModel',
            content: '<h2>Some Content</h2>'
        };
        var expectedResult = "<header>I'm the header. Master Title-11-blue</header><h2>Some Content</h2><footer>I'm the footer</footer>";
        return expect(templateService.RenderObject(objectWithTemplate)).to.eventually.equal(expectedResult);
    });

    it("can use both layout and content template model properties in a content template", function () {
        var objectWithTemplate = {
            favoriteColor: 'blue',
            layout: 'masterWithModel',
            content: '<h2>Some Content. {{title}}-{{favoriteNumber}}-{{favoriteColor}}</h2>'
        };
        var expectedResult = "<header>I'm the header. Master Title-11-blue</header><h2>Some Content. Master Title-11-blue</h2><footer>I'm the footer</footer>";
        return expect(templateService.RenderObject(objectWithTemplate)).to.eventually.equal(expectedResult);
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
        return expect(templateService.RenderObject(objectWithTemplate)).to.eventually.equal(expectedResult);
    });

    // Need to convert front matter into properties and create a template object containing those properties as well as a
    //  content property with the template in it.
    it("can convert 'pure content' template strings with simple front matter into template objects"); // front matter

    // Need to convert front matter queries into datasets in template object
    it("can convert 'pure content' template strings with front matter queries into template objects"); // front matter

    // same as above but queries not defined in front matter, but in the content object itself
    it("can declare model queries in templates");
});
