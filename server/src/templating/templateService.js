var TemplateEngine = require("./templateEngine");
var CustomDataService = require("../customData/customDataService");
var database = require("../database/database");
var Promise = require("bluebird");
var frontMatter = require('front-matter');
var _ = require("lodash");

var TemplateRepo = function() {
    var templateRepo = {};

    var templateObjects = [];
    templateObjects.push({
        name: 'master',
        content: "<header>I'm the header</header>{{ content }}<footer>I'm the footer</footer>"
    });
    templateObjects.push({
        name: 'masterWithModel',
        title: 'Master Title',
        favoriteNumber: 11,
        content: "<header>I'm the header. {{title}}-{{favoriteNumber}}-{{favoriteColor}}</header>{{ content }}<footer>I'm the footer</footer>"
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

    templateRepo.getTemplate = function(templateName) {
        var templateObject = _.find(templateObjects, {name: templateName});
        return templateObject;
    };

    return templateRepo;
};

var TemplateService = function(args) {
    var templateService = {};
    var templateRepo = (args && args.templateRepo) ? args.templateRepo : new TemplateRepo();
    var templateEngine = new TemplateEngine({engineType: 'liquid', templateRepo: templateRepo});
    var orgId = 1; // todo: alter to use auth mechanism (currently logged in user's orgId)
    var customDataService = {};
    customDataService = new CustomDataService(database);

    templateService.renderObject = function(objectWithTemplate) {
        var template = objectWithTemplate.content;
        var model = _.omit(objectWithTemplate, 'content');
        var renderPromise = null;

        if (objectWithTemplate.layout) {
            var layoutObject = templateRepo.getTemplate(objectWithTemplate.layout);
            renderPromise = templateService.RenderInsideLayout(objectWithTemplate, layoutObject)
                .then(function (output) {
                    return output;
                });
        }
        else {
            renderPromise = templateEngine.Render(template, model)
                .then(function (output) {
                    return output;
                });
        }

        return renderPromise;
    };

    templateService.convertStringToTemplateObject = function(stringToConvert) {
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
    };

    templateService.convertTemplateObjectQueriesToResultSets = function (templateObject) {
        var deferred = Promise.pending();
        var hasRQL = false;

        for (var property in templateObject.model) {
            if (_.isString(templateObject.model[property]) && _.startsWith(templateObject.model[property], 'contentType=')) {
                hasRQL = true;
                // have to wrap property in a closure, otherwise property is different by the time the "then" gets called
                (function (property) {
                    customDataService.find(orgId, templateObject.model[property])
                        .then(function (result) {
                            templateObject.model[property] = result;
                            return deferred.resolve(templateObject);
                        })
                        .then(null, function(error) { // todo: replace with catch once I fix the promises coming back from Monk.
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

    templateService.RenderInsideLayout = function (contentObject, layoutObject) {
        var contentTemplate = contentObject.content;
        var contentModel = _.omit(contentObject, 'content');
        var layoutTemplate = layoutObject.content;
        var layoutModel = _.omit(layoutObject, 'content');

        // merge contentTemplate's model with layoutTemplate's model
        var combinedModel = _.assign(layoutModel, contentModel);

        // render contentTemplate using that same model
        var renderPromise = templateEngine.Render(contentTemplate, combinedModel)
            .then(function (contentOutput) {
                // make the content's rendered output available as the content property of the layout
                combinedModel.content = contentOutput;
            })
            .then(function () {
                // render layoutTemplate
                var layoutRenderPromise = templateEngine.Render(layoutTemplate, combinedModel)
                    .then(function (layoutOutput) {
                        return layoutOutput;
                    });
                return layoutRenderPromise;
            });

        return renderPromise;
    };


    return templateService;
};

module.exports = TemplateService;
