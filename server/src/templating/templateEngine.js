var assert = require('assert');
var BPromise = require("bluebird");
//var swig = require('swig');
var Liquid = require('liquid-node');
var util = require('util');
var _ = require("lodash");

// Constructor
var TemplateEngine = function(args) {
    assert.ok(args.engineType, 'engine is required');
    var templateEngine = {};
    templateEngine.engineType = args.engineType;
    templateEngine.engine = new Liquid.Engine();

    var templateObjects = [];
    templateObjects.push({
        name: 'master',
        content: "<header>I'm the header</header>{{ content }}<footer>I'm the footer</footer>"
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

    templateEngine.getTemplate = function (templateName) {
        var templateObject = _.find(templateObjects, {name: templateName});
        return templateObject;
    };

    // Override Liquid's filesystem lookup to use our own mechanism for getting templates by name
    var CustomFileSystem = function() {};
    util.inherits(CustomFileSystem, Liquid.BlankFileSystem);

    CustomFileSystem.prototype.readTemplateFile = function(path) {
        return new BPromise(function(resolve, reject) {
            var templateObject = templateEngine.getTemplate(path);
            if (templateObject && templateObject.content) {
                return resolve(templateObject.content);
            } else {
                return reject('template not found');
            }
        });
    };

    templateEngine.engine.fileSystem = new CustomFileSystem();


    templateEngine.Render = function(templateString, model) {
        //var result = swig.render(templateString, model);
//        templateEngine.engine.parseAndRender(templateString, model)
//            .then(function(result) {
//                next(null, result);
//            })
//            .catch(function(err) {
//                next(err);
//            });

//        templateEngine.engine.parse(templateString)
//            .then(function (template) {
//                return template.render(model);
//            })
//            .then(function (result) {
//                next(null, result);
//            });

        var renderPromise = templateEngine.engine.parse(templateString)
            .then(function (template) {
                return template.render(model);
            })
            .then(function(result) {
                console.log(result);
                return result;
            });

        return renderPromise;
    };

    return templateEngine;
};

module.exports = TemplateEngine;

