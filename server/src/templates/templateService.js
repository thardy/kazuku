"use strict";

var GenericService = require("../common/genericService");
var TemplateEngine = require("./templateEngine");
var CustomDataService = require("../customData/customDataService");
var DependencyService = require("../dependencies/dependencyService");
var QueryService = require("../queries/queryService");
var Promise = require("bluebird");
var frontMatter = require('front-matter');
var _ = require("lodash");

const systemProperties = ["_id", "id", "orgId", "siteId", "name", "url", "layout", "template", "created", "createdBy", "updated", "updatedBy", "dependencies", "regenerate"];

class TemplateService extends GenericService {
    constructor(database, queryService, getTemplate) {
        super(database, 'templates');

        // TemplateService now implements the function getTemplate that the templateEngine requires.  Use that if
        //  a getTemplate function was not supplied.
        this._getTemplateFunction = (getTemplate) ? getTemplate : this.getTemplate.bind(this);

        this._orgId = 1; // todo: alter to use auth mechanism (currently logged in user's orgId)
        this._queryService = (queryService) ? queryService : new QueryService(database);
        this._customDataService = new CustomDataService(database);
        this._dependencyService = new DependencyService(database);
        this._templateEngine = new TemplateEngine({
            engineType: 'liquid',
            getTemplate: this._getTemplateFunction,
            queryService: this._queryService, // templateEngine needs this to resolve queries on models
            orgId: this._orgId // needed for resolving queries on models
        });
    }

    get templateEngine() { return this._templateEngine; }
    get queryService() { return this._queryService; }
    get customDataService() { return this._customDataService; }
    get dependencyService() { return this._dependencyService; }
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

    renderObject(orgId, objectWithTemplate) {
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

        // At this point, the queries should be resolved, but we still need to replace our model properties with their results
        return this.queryService.resolveQueryPropertiesOnModel(orgId, model)
            .then((result) => { // result is inconsequential. model should have been modified directly.
                let renderPromise = null;

                if (objectWithTemplate.layout) {
                    renderPromise = this.getTemplateFunction(objectWithTemplate.layout)
                        .then((layoutObject) => {
                            return this.renderInsideLayout(objectWithTemplate.template, model, layoutObject)
                                .then((output) => {
                                    return output; // just for debugging
                                });
                        })
                        .then(null, (e) => { //.catch(e => {  todo: have to do this until I get rid of monk, whose promises don't have a catch
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
            });

    }

    // getTemplate returns a templateObject
    getTemplate(templateName) {
        return this.find(this.orgId, {name: templateName})
            .then((templateObjectArray) => { // todo: do we need to add a catch here as well since we are altering the output from an array to a single object?
                return templateObjectArray[0];
            });
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
        // todo: refactor to use cleaner/newer Promise usage
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

    renderInsideLayout(template, model, layoutObject) {
        var layoutTemplate = layoutObject.template;
        var layoutModel = _.omit(layoutObject, 'template');

        // Need to resolve any query properties on the layout model
        return this.queryService.resolveQueryPropertiesOnModel(this.orgId, layoutModel)
            .then((result) => {
                // merge contentTemplate's model with layoutTemplate's model
                var combinedModel = _.assign(layoutModel, model);

                // render contentTemplate using that same model
                var renderPromise = this.templateEngine.Render(template, combinedModel)
                    .then((contentOutput) => {
                        // make the content's rendered output available as the content property of the layout
                        combinedModel.content = contentOutput;
                    })
                    .then(() => {
                        // render layoutTemplate
                        var layoutRenderPromise = this.templateEngine.Render(layoutTemplate, combinedModel)
                            .then((layoutOutput) => {
                                return layoutOutput; // just for debugging
                            });
                        return layoutRenderPromise;
                    });

                return renderPromise;
            });

    }


    // item should be of format - { type: "template", name: "master" }
    getAllDependentsOfItem(item) {
        // Get all templates that have the given item in their dependencies array.  dependency properties on templates
        // look like this - { dependencies: [{type: 'template', name: 'master' }] }
        return this.collection.find({orgId: this.orgId, dependencies: item })
            .then((docs) => {
                var dependentItems = [];
                _.forEach(docs, (doc) => {
                    let itemType = "url" in doc ? "page" : "template";
                    dependentItems.push({type: itemType, name: doc.name});
                });

                return dependentItems;
            })
            .then(null, (error) => { // todo: replace with catch once I fix the promises coming back from Monk.
                throw error;
            });
    }

    getDependenciesOfTemplate(templateObject) {
        let dependencies = [];

        // a layout is a dependency
        if ("layout" in templateObject) {
            dependencies.push({type: "template", name: templateObject.layout});
        }

        // any queries defined in the model are dependencies
        // look at all properties on the templateObject that aren't system properties to see if they are queries
        for (let property in templateObject) {
            if (templateObject.hasOwnProperty(property) && !systemProperties.contains(property)) {
                let queryDependencies = this.queryService.getDependenciesOfQuery(templateObject[property]);
                if (queryDependencies !== undefined) {
                    dependencies = dependencies.concat(queryDependencies);
                }
            }
        }

        // any includes in the template are dependencies
        let includedTemplateDependencies = this.getIncludedTemplateDependencies(templateObject.template);
        if (includedTemplateDependencies !== undefined) {
            dependencies = dependencies.concat(includedTemplateDependencies);
        }

        return dependencies;
    }

    getIncludedTemplateDependencies(templateString) {
        let includedTemplateDependencies = [];

        // We are looking for the following strings - {% include 'header' %}, to pull out the name inside the include
        templateString.replace(/{%\s?include '([a-zA-Z0-9-_]*)'[ %]/g, (match, group1) => {
            includedTemplateDependencies.push({ type: "template", name: group1 });
        });

        return includedTemplateDependencies;
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

    onBeforeCreate(orgId, templateObject) {
        // add/overwrite dependencies property
        templateObject["dependencies"] = this.getDependenciesOfTemplate(templateObject);
        return Promise.resolve();
    }

    onBeforeUpdate(orgId, templateObject) {
        // add/overwrite dependencies property
        templateObject["dependencies"] = this.getDependenciesOfTemplate(templateObject);
        return Promise.resolve();
    }

    onAfterCreate(orgId, templateObject) {
        return Promise.resolve(templateObject);
    }
    onAfterUpdate(orgId, templateObject) {
        // An item changes - recursively get everything dependent on the item that changed
        return this.dependencyService.getRegenerationListForItem(orgId, {type: 'template', name: templateObject.name })
            .then((dependentObjects) => {
                return this.dependencyService.flagDependentItemsForRegeneration(orgId, dependentObjects);
            });
    }
}

module.exports = TemplateService;
