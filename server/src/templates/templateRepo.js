//var TemplateEngine = require("./templateEngine");
//var CustomDataService = require("../customData/customDataService");
//var database = require("../database/database");
//var Promise = require("bluebird");
//var frontMatter = require('front-matter');
//var _ = require("lodash");

// todo: move this into the TemplateService proper, once I have that actually pulling data from mongo
//var TemplateRepo = function() {
//    var templateRepo = {};
//
//    var templateObjects = [];
//    templateObjects.push({
//        name: 'master',
//        content: "<header>I'm the header</header>{{ content }}<footer>I'm the footer</footer>"
//    });
//    templateObjects.push({
//        name: 'masterWithModel',
//        title: 'Master Title',
//        favoriteNumber: 11,
//        content: "<header>I'm the header. {{title}}-{{favoriteNumber}}-{{favoriteColor}}</header>{{ content }}<footer>I'm the footer</footer>"
//    });
//    templateObjects.push({
//        name: 'dog',
//        content: "dogs are nice"
//    });
//    templateObjects.push({
//        name: 'cat',
//        content: "cats are ok"
//    });
//    templateObjects.push({
//        name: 'chicken',
//        content: "chickens are {{disposition}}"
//    });
//
//    templateRepo.getTemplate = function(templateName) {
//        var templateObject = _.find(templateObjects, {name: templateName});
//        return templateObject;
//    };
//
//    return templateRepo;
//};

//module.exports = TemplateRepo;
