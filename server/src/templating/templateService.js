var TemplateEngine = require("./templateEngine");
var _ = require("lodash");

var TemplateService = function(args) {
    var templateService = {};
    var templateEngine = new TemplateEngine({engineType: 'liquid'});

    templateService.RenderObject = function(objectWithTemplate) {
        var template = objectWithTemplate.content;
        var model = _.omit(objectWithTemplate, 'content');
        var renderPromise = null;

        if (objectWithTemplate.layout) {
            var layoutObject = templateEngine.getTemplate(objectWithTemplate.layout);
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
