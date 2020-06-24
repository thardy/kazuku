"use strict";

import assert from 'assert';
import Promise from 'bluebird';
//var swig = require('swig');
//var Liquid = require('liquid-node');
import Liquid from 'shopify-liquid';
import _ from 'lodash';
import current from '../common/current.js';

// Constructor
var TemplateEngine = function(args) {
    assert.ok(args.engineType, 'engineType is required');
    assert.ok(args.getTemplate, 'getTemplate is required');
    assert.ok(args.queryService, 'queryService is required');
    var templateEngine = {};
    templateEngine.engineType = args.engineType;
    //templateEngine.engine = new Liquid.Engine();
    templateEngine.engine = new Liquid();
    templateEngine.getTemplate = args.getTemplate;
    let queryService = args.queryService;

    // Override shopify-liquid's getTemplate lookup to use our own mechanism for getting templates by nameId
    templateEngine.engine.getTemplate = function(path) {
        return templateEngine.getTemplate(current.context.orgId, path)
           .then((templateObject) => {
               if (templateObject && templateObject.template) {
                   return queryService.resolveQueryPropertiesOnModel(current.context.orgId, templateObject)
                       .then(result => {
                           // result is inconsequential.  The templateObject should have been altered directly.
                           return templateObject; // return the templateObject
                       });
               }
               else {
                   throw new Error(`template '${path}' not found for orgId '${current.context.orgId}'`);
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

export default TemplateEngine;

