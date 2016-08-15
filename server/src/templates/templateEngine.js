"use strict";

var assert = require('assert');
var Promise = require("bluebird");
//var swig = require('swig');
var Liquid = require('liquid-node');
var util = require('util');
var _ = require("lodash");

// Constructor
var TemplateEngine = function(args) {
    assert.ok(args.engineType, 'engineType is required');
    assert.ok(args.getTemplate, 'getTemplate is required');
    var templateEngine = {};
    templateEngine.engineType = args.engineType;
    templateEngine.engine = new Liquid.Engine();
    templateEngine.getTemplate = args.getTemplate;

    // Override Liquid's filesystem lookup to use our own mechanism for getting templates by name
    var CustomFileSystem = function() {};
    util.inherits(CustomFileSystem, Liquid.BlankFileSystem);

    // readTemplateFile returns an actual template string, not a templateObject
    CustomFileSystem.prototype.readTemplateFile = function(path) {
        return templateEngine.getTemplate(path)
            .then((templateObject) => {
                if (templateObject && templateObject.template) {
                    // todo: I suspect that my returning of only the templates here and not the model that goes with it
                    //  is causing all of my includes to not render properly. e.g. RegenerateTemplate-Navigation references
                    //  navItems, which the parsing engine won't have a clue where that comes from when used in an include.
                    //  Has liquid-node been updated to accept a model with an include?  Just a template is not enough.  Every
                    //  include needs its model that goes with it, the entire templateObject.
                    return templateObject.template; // return the template itself
                }
                else {
                    throw new Error(`template '${path}' not found`);
                }
            });

    };

    templateEngine.engine.fileSystem = new CustomFileSystem();


    templateEngine.Render = function(templateString, model) {
        var renderPromise = templateEngine.engine.parse(templateString)
            .then((template) => {
                return template.render(model);
            })
            .then((renderedTemplateOutput) => {
                console.log(renderedTemplateOutput);
                return renderedTemplateOutput;
            })
            .then(null, (e) => {
                console.log(e);
            });

        return renderPromise;
    };

    return templateEngine;
};

module.exports = TemplateEngine;

