var assert = require('assert');
var BPromise = require("bluebird");
//var swig = require('swig');
var Liquid = require('liquid-node');
var util = require('util');

// Constructor
var TemplateEngine = function(args) {
    assert.ok(args.engineType, 'engine is required');
    var templateEngine = {};
    templateEngine.engineType = args.engineType;
    templateEngine.engine = new Liquid.Engine();

    // Override Liquid's filesystem lookup to use our own mechanism for getting templates by name
    var CustomFileSystem = function() {};
    util.inherits(CustomFileSystem, Liquid.BlankFileSystem);

    CustomFileSystem.prototype.readTemplateFile = function(path) {
        return new BPromise(function(resolve, reject) {
            if (path === 'dog') {
                return resolve('dogs are nice');
            } else if (path === 'cat') {
                return resolve('cats are ok');
            } else if (path === 'chicken') {
                return resolve('chickens are {{disposition}}');
            } else {
                return reject('not dog or cat');
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

