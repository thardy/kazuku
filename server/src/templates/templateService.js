"use strict";

var GenericService = require("../common/genericService");
var TemplateEngine = require("./templateEngine");
var CustomDataService = require("../customData/customDataService");
var QueryService = require("../queries/queryService");
var Promise = require("bluebird");
var frontMatter = require('front-matter');
var _ = require("lodash");

class TemplateService extends GenericService {
    constructor(database, queryService, getTemplate) {
        super(database, 'templates');

        // TemplateService now implements the function getTemplate that the templateEngine requires.  Use that if
        //  a getTemplate function was not supplied.
        this._getTemplateFunction = (getTemplate) ? getTemplate : this.getTemplate.bind(this);
        this._templateEngine = new TemplateEngine({engineType: 'liquid', getTemplate: this._getTemplateFunction});
        this._orgId = 1; // todo: alter to use auth mechanism (currently logged in user's orgId)

        this._queryService = (queryService) ? queryService : new QueryService(database);
        this._customDataService = new CustomDataService(database);
    }

    get templateEngine() { return this._templateEngine; }
    get queryService() { return this._queryService; }
    get customDataService() { return this._customDataService; }
    get orgId() { return this._orgId; }
    get getTemplateFunction() { return this._getTemplateFunction; }

    getRegenerateList(orgId) {
        return this.collection.find({orgId: orgId, regenerate: 1})
            .then((docs) => {
                var transformedDocs = [];
                _.forEach(docs, (doc) => {
                    this.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            });
    }

    renderObject(objectWithTemplate) {
        // Use either template or content properties
        let template;

        if ("template" in objectWithTemplate) {
            template = objectWithTemplate.template;
        }
        else if ("content" in objectWithTemplate) {
            template = objectWithTemplate.content;
        }
        else {
            // if objectWithTemplate doesn't have a template or content property, just return a resolved Promise.
            return Promise.resolve("");
        }

        let model = _.omit(objectWithTemplate, 'template', 'content');
        // At this point, the queries should be resolved, but we still need to replace our model properties with their results,
        //  unless we decide to do that earlier in this batch
//        this.queryService.resolveQueries(model)
//            .then((modelAfterQueriesResolved) => {
//
//            });
        let renderPromise = null;

        if (objectWithTemplate.layout) {
            renderPromise = this.getTemplateFunction(objectWithTemplate.layout)
                .then((templateObject) => {
                    return this.renderInsideLayout(objectWithTemplate, templateObject)
                        .then((output) => {
                            return output; // just for debugging
                        });
                })
                .then(null, (e) => { //.catch(e => {  have to do this until I get rid of monk, whose promises don't have a catch
                    throw e;
                });
        }
        else {
            renderPromise = this.templateEngine.Render(template, model)
                .then((output) => {
                    return output;
                })
                .catch(e => {
                    throw e;
                });
        }

        return renderPromise;
    }

    // getTemplate returns a templateObject
    getTemplate(templateName) {
        return this.find(this.orgId, {name: templateName})
            .then((templateObjectArray) => { // todo: do we need to add a catch here as well since we are altering the output from an array to a single object?
                return templateObjectArray[0];
            });
    };

    convertStringToTemplateObject(stringToConvert) {
//        var deferred = Promise.pending();
        var frontMatterObject = frontMatter(stringToConvert);
        var templateObject = {
            model: frontMatterObject.attributes,
            template: frontMatterObject.body
        };

        return templateObject;
//        var templateObject = this.convertTemplateObjectQueriesToResultSets(templateObject);
//        deferred.resolve(templateObject);
//        return deferred.promise;
    }

    convertTemplateObjectQueriesToResultSets(templateObject) {
        var deferred = Promise.pending();
        var hasRQL = false;

        for (var property in templateObject.model) {
            if (_.isString(templateObject.model[property]) && _.startsWith(templateObject.model[property], 'contentType=')) {
                hasRQL = true;
                // have to wrap property in a closure, otherwise property is different by the time the "then" gets called
                ((property) => {
                    this.customDataService.find(this.orgId, templateObject.model[property])
                        .then((result) => {
                            templateObject.model[property] = result;
                            return deferred.resolve(templateObject);
                        })
                        .then(null, (error) => { // todo: replace with catch once I fix the promises coming back from Monk.
                            return deferred.reject(error);
                        });
                })(property);
            }
        }

        if (!hasRQL) {
            deferred.resolve(templateObject);
        }

        return deferred.promise;
    }

    renderInsideLayout(contentObject, layoutObject) {
        var contentTemplate = contentObject.template;
        var contentModel = _.omit(contentObject, 'template');
        var layoutTemplate = layoutObject.template;
        var layoutModel = _.omit(layoutObject, 'template');

        // merge contentTemplate's model with layoutTemplate's model
        var combinedModel = _.assign(layoutModel, contentModel);

        // render contentTemplate using that same model
        var renderPromise = this.templateEngine.Render(contentTemplate, combinedModel)
            .then((contentOutput) => {
                // make the content's rendered output available as the content property of the layout
                combinedModel.content = contentOutput;
            })
            .then(() => {
                // render layoutTemplate
                var layoutRenderPromise = this.templateEngine.Render(layoutTemplate, combinedModel)
                    .then((layoutOutput) => {
                        return layoutOutput;
                    });
                return layoutRenderPromise;
            });

        return renderPromise;
    }


    getAllDependentsOfItem(item) {
        return [];
    }

    validate(doc) {
        if (doc.name && doc.template) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return "Need name and template";
        }
    }

}

module.exports = TemplateService;
