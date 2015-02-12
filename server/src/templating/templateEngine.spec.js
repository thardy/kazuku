var should = require("should");
var TemplateEngine = require("./templateEngine");

describe("TemplateEngine", function() {
    describe("defaults", function() {
        var templateEngine = {};

        before(function() {
            templateEngine = new TemplateEngine({engine: "swig"});
        });

        it("engine is swig");
        it("has a chicken");
        it("is just right 5");

    });
});
