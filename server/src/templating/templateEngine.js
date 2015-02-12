var assert = require("assert");

// Constructor
var TemplateEngine = function(args) {
    assert.ok(args.engine, "engine is required");
    var templateEngine = {};

    // Random comment
    templateEngine.engine = args.engine;
    templateEngine.chickenStuff = args.chickenStuff || null;

    return templateEngine;
};

module.exports = TemplateEngine;
