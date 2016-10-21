"use strict";

var assert = require('assert');
var Promise = require("bluebird");
//var swig = require('swig');
//var Liquid = require('liquid-node');
var Liquid = require('shopify-liquid');
var util = require('util');
var _ = require("lodash");

// Constructor
var TemplateEngine = function(args) {
    assert.ok(args.engineType, 'engineType is required');
    assert.ok(args.getTemplate, 'getTemplate is required');
    assert.ok(args.queryService, 'queryService is required');
    assert.ok(args.orgId, 'orgId is required');
    var templateEngine = {};
    templateEngine.engineType = args.engineType;
    //templateEngine.engine = new Liquid.Engine();
    templateEngine.engine = new Liquid();
    templateEngine.getTemplate = args.getTemplate;
    let queryService = args.queryService;
    let orgId = args.orgId;

    // Override shopify-liquid's getTemplate lookup to use our own mechanism for getting templates by name
    templateEngine.engine.getTemplate = function(path) {
        return templateEngine.getTemplate(path)
           .then((templateObject) => {
               if (templateObject && templateObject.template) {
                   return queryService.resolveQueryPropertiesOnModel(orgId, templateObject)
                       .then(result => {
                           // result is inconsequential.  The templateObject should have been altered directly.
                           return templateObject; // return the templateObject
                       });
               }
               else {
                   throw new Error(`template '${path}' not found`);
               }
           });
    };

//    var CustomFileSystem = function() {};
//    util.inherits(CustomFileSystem, Liquid.BlankFileSystem);
//
//    // readTemplateFile returns an actual template string, not a templateObject
//    CustomFileSystem.prototype.readTemplateFile = function(path) {
//        return templateEngine.getTemplate(path)
//            .then((templateObject) => {
//                if (templateObject && templateObject.template) {
//                    // Here's exactly what is happening.  If I can have the basic render promise do what it is doing now,
//                    //  it will replace any includes with their template strings then evaluate the whole thing against the top-most model.
//                    // todo: figure out how to propagate every included model up to the top-most model OR switch out the template engine
//                    return templateObject.template; // return the template itself
//                }
//                else {
//                    throw new Error(`template '${path}' not found`);
//                }
//            });
//
//    };
//
//    templateEngine.engine.fileSystem = new CustomFileSystem();

    templateEngine.Render = function(templateString, model) {
        var renderPromise = templateEngine.engine.parseAndRender(templateString, model)
            .then((renderedTemplateOutput) => {
                //console.log(renderedTemplateOutput);
                return renderedTemplateOutput;
            })
            .catch((e) => {
                console.log(e);
                throw e;
            });

        return renderPromise;
    };

    return templateEngine;
};

module.exports = TemplateEngine;

