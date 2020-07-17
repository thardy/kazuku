'use strict';

import GenericService from '../common/genericService.js';
import TemplateEngine from './templateEngine.js';
import CustomDataService from '../customData/customDataService.js';
import DependencyService from '../dependencies/dependencyService.js';
import QueryService from '../queries/queryService.js';
import Promise from 'bluebird';
import frontMatter from 'front-matter';
import _ from 'lodash';
import current from '../common/current.js';

const systemProperties = ["_id", "id", "orgId", "siteId", "name", "url", "layout", "template", "created", "createdBy", "updated", "updatedBy", "dependencies", "regenerate"];

class TemplateService extends GenericService {
    constructor(database, queryService, getTemplate) {
        super(database, 'templates');

        // TemplateService now implements the function getTemplate that the templateEngine requires.  Use that if
        //  a getTemplate function was not supplied.
        this.getTemplateFunction = (getTemplate) ? getTemplate : this.getTemplate.bind(this);

        this.queryService = (queryService) ? queryService : new QueryService(database);
        this.customDataService = new CustomDataService(database);
        this.dependencyService = new DependencyService(database);
        this.templateEngine = new TemplateEngine({
            engineType: 'liquid',
            getTemplate: this.getTemplateFunction,
            queryService: this.queryService, // templateEngine needs this to resolve queries on models
            //orgId: this.orgId // needed for resolving queries on models
        });
    }

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
        else if ("content" in objectWithTemplate) { // todo: consider removing 'content' and always using 'template'
            template = objectWithTemplate.content;
        }
        else {
            // if objectWithTemplate doesn't have a template or content property, just return a resolved Promise.
            return Promise.resolve("");
        }

        let model = _.omit(objectWithTemplate, 'template', 'content'); // todo: consider omitting all system properties (orgId, created, createdBy, etc)

        // At this point, the queries should be resolved, but we still need to replace our model properties with their results
        return this.queryService.resolveQueryPropertiesOnModel(orgId, model)
            .then((result) => { // result is inconsequential. model should have been modified directly.
                let renderPromise = null;

                if (objectWithTemplate.layout) {
                    // layout must be snake-cased
                    renderPromise = this.getTemplateFunction(orgId, objectWithTemplate.layout)
                        .then((layoutObject) => {
                            return this.renderInsideLayout(orgId, objectWithTemplate.template, model, layoutObject)
                                .then((output) => {
                                    return output; // just for debugging
                                });
                        })
                        .catch(e => {
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
    getTemplate(orgId, templateNameId) {
        return this.collection.findOne({orgId: orgId, nameId: templateNameId})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
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

    convertTemplateObjectQueriesToResultSets(orgId, templateObject) {
        // todo: refactor to use cleaner/newer Promise usage
        var deferred = Promise.pending();
        var hasRQL = false;

        for (var property in templateObject.model) {
            if (_.isString(templateObject.model[property]) && _.startsWith(templateObject.model[property], 'contentType=')) {
                hasRQL = true;
                // have to wrap property in a closure, otherwise property is different by the time the "then" gets called
                ((property) => {
                    this.customDataService.find(orgId, templateObject.model[property])
                        .then((result) => {
                            templateObject.model[property] = result;
                            return deferred.resolve(templateObject);
                        })
                        .catch(error => {
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

    renderInsideLayout(orgId, template, model, layoutObject) {
        var layoutTemplate = layoutObject.template;
        var layoutModel = _.omit(layoutObject, 'template');

        // Need to resolve any query properties on the layout model
        return this.queryService.resolveQueryPropertiesOnModel(orgId, layoutModel)
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


    // item should be of format - { type: "template", nameId: "master" }
    // todo: I don't think this is used anymore.  Convert anything using this to use dependencyService.getAllDependentsOfItem instead
    getAllDependentsOfItem(orgId, item) {
        // Get all templates that have the given item in their dependencies array.  dependency properties on templates
        // look like this - { dependencies: [{type: 'template', nameId: 'master' }] }
        return this.collection.find({orgId: orgId, dependencies: item })
            .then((docs) => {
                var dependentItems = [];
                _.forEach(docs, (doc) => {
                    let itemType = "url" in doc ? "page" : "template";
                    dependentItems.push({type: itemType, nameId: doc.nameId});
                });

                return dependentItems;
            })
            .catch(error => {
                throw error;
            });
    }

    getDependenciesOfTemplate(templateObject) {
        let dependencies = [];

        // a layout is a dependency.  layout property must be snake-cased nameId of the template that is the layout
        if ("layout" in templateObject) {
            dependencies.push({type: "template", nameId: templateObject.layout});
        }

        // any queries defined in the model are dependencies
        // look at all properties on the templateObject that aren't system properties to see if they are queries
        for (let property in templateObject) {
            if (templateObject.hasOwnProperty(property) && !systemProperties.includes(property)) {
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

        // We are looking for the following strings - {% include 'header' %}, to pull out the name inside the include.
        //  The names should be kebab-cased nameIds.
        templateString.replace(/{%\s?include '([a-zA-Z0-9-_]*)'[ %]/g, (match, group1) => {
            includedTemplateDependencies.push({ type: "template", nameId: group1.toLowerCase() });
        });

        return includedTemplateDependencies;
    }

    validate(doc) {
        if (doc.name && doc.nameId && doc.template) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return 'Need name, nameId, and template';
        }
    }

    onBeforeCreate(orgId, templateObject) {
        templateObject['regenerate'] = 1;
        // add/overwrite dependencies property
        templateObject['dependencies'] = this.getDependenciesOfTemplate(templateObject);
        return super.onBeforeCreate(orgId, templateObject);
    }

    onBeforeUpdate(orgId, templateObject) {
        if ("url" in templateObject) {
            // set regenerate flag only if template is a page
            templateObject['regenerate'] = 1;
        }
        // !!! We need to always update the entire templateObject.  Partial updates can cause this dependencies check
        //  and subsequent overwrite to be inaccurate, saving a faulty dependencies array
        // add/overwrite dependencies property
        templateObject['dependencies'] = this.getDependenciesOfTemplate(templateObject);
        return super.onBeforeUpdate(orgId, templateObject);
    }

    onAfterCreate(orgId, templateObject) {
        return super.onAfterCreate(orgId, templateObject);
    }
    onAfterUpdate(orgId, templateObject) {
        // An item changes - recursively get everything dependent on the item that changed
        return this.dependencyService.getAllDependentsOfItem(orgId, {type: 'template', nameId: templateObject.nameId })
            .then((dependentObjects) => {
                return this.dependencyService.flagDependentItemsForRegeneration(orgId, dependentObjects);
            })
            .then((result) => {
                return super.onAfterUpdate(orgId, result);
            });
    }
}

export default TemplateService;
