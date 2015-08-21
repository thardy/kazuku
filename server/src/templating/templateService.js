var TemplateEngine = require("./templateEngine");
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

    templateService.RenderObject = function(objectWithTemplate) {
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
