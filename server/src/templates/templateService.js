"use strict";

var GenericService = require("../common/genericService");
var TemplateEngine = require("./templateEngine");
var TemplateRepo = require("./templateRepo");
var CustomDataService = require("../customData/customDataService");
var Promise = require("bluebird");
var frontMatter = require('front-matter');
var _ = require("lodash");

class TemplateService extends GenericService {
    constructor(database, templateRepo) {
        super(database, 'templates');

        this._templateRepo = (templateRepo) ? templateRepo : new TemplateRepo();
        this._templateEngine = new TemplateEngine({engineType: 'liquid', templateRepo: this._templateRepo});
        this._orgId = 1; // todo: alter to use auth mechanism (currently logged in user's orgId)
        this._customDataService = new CustomDataService(database);
    }

    get templateRepo() { return this._templateRepo; }
    get templateEngine() { return this._templateEngine; }
    get customDataService() { return this._customDataService; }
    get orgId() { return this._orgId; }

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
        let renderPromise = null;

        if (objectWithTemplate.layout) {
            let layoutObject = this.templateRepo.getTemplate(objectWithTemplate.layout);
            renderPromise = this.renderInsideLayout(objectWithTemplate, layoutObject)
                .then((output) => {
                    return output;
                });
        }
        else {
            renderPromise = this.templateEngine.Render(template, model)
                .then((output) => {
                    return output;
                });
        }

        return renderPromise;
    }

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
        var contentTemplate = contentObject.content;
        var contentModel = _.omit(contentObject, 'content');
        var layoutTemplate = layoutObject.content;
        var layoutModel = _.omit(layoutObject, 'content');

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
