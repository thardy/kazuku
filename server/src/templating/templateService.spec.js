var TemplateService = require('./templateService');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;

chai.use(chaiAsPromised);

describe("TemplateService Layouts", function () {
    var templateService = {};
    var engineType = 'liquid';

    before(function() {
        templateService = new TemplateService();
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

    it("can use both content and layout template model properties in a layout template");

    it("can use both layout and content template model properties in a content template");

    it("override layout model properties with content model properties with the same name");

    it("can convert 'pure content' template strings with front matter into template objects"); // front matter

    it("can declare model queries in templates");
});
