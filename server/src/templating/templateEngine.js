var assert = require('assert');
var swig = require('swig');

// Constructor
var TemplateEngine = function(args) {
    assert.ok(args.engine, 'engine is required');
    var templateEngine = {};

    // Random comment
    templateEngine.engine = args.engine;

    templateEngine.Render = function(templateString, model) {
        var result = swig.render(templateString, model);
        return result;
    };

    return templateEngine;
};

module.exports = TemplateEngine;

