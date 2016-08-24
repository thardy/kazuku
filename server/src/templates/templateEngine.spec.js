"use strict";

var Promise = require("bluebird");
var TemplateEngine = require('./templateEngine');
var _ = require("lodash");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;

chai.use(chaiAsPromised);

var FakeTemplateRepo = function() {
    var templateRepo = {};

    var templateObjects = [];
    templateObjects.push({
        name: 'master',
        template: "<header>I'm the header</header>{{ content }}<footer>I'm the footer</footer>"
    });
    templateObjects.push({
        name: 'masterWithModel',
        title: 'Master Title',
        favoriteNumber: 11,
        template: "<header>I'm the header. {{title}}-{{favoriteNumber}}-{{favoriteColor}}</header>{{ content }}<footer>I'm the footer</footer>"
    });
    templateObjects.push({
        name: 'dog',
        template: "dogs are nice"
    });
    templateObjects.push({
        name: 'cat',
        template: "cats are ok"
    });
    templateObjects.push({
        name: 'chicken',
        template: "chickens are {{disposition}}"
    });

    // getTemplate returns a templateObject
    templateRepo.getTemplate = function(templateName) {
        var resolver = Promise.defer();
        var foundTemplateObject = _.find(templateObjects, {name: templateName});
        setTimeout(function () {
            resolver.resolve(foundTemplateObject);
        }, 100);
        return resolver.promise;
    };

    return templateRepo;
};

describe('TemplateEngine basics', function() {
    var templateEngine = {};
    var engineType = 'liquid';

    before(function() {
        var fakeTemplateRepo = new FakeTemplateRepo();
        templateEngine = new TemplateEngine({engineType: engineType, getTemplate: fakeTemplateRepo.getTemplate.bind(fakeTemplateRepo)});
    });

    it('engine is what we asked for', function() {
        templateEngine.engineType.should.equal(engineType);
    });

    it('can render using a model', function() {
        var templateString = '{% if foo %}Hello World{% endif %}';
        var model = { foo: true };

        return expect(templateEngine.Render(templateString, model)).to.eventually.equal('Hello World');
    });

    it('can render using a conditional', function() {
        var templateString = '{% if foo %}Hello World{% endif %}';
        var model = { foo: false };

        return expect(templateEngine.Render(templateString, model)).to.eventually.equal('');
    });

    it('can use a CustomFileSystem to embed templates', function () {
        var templateString = '{% include dog %}. Hello World {{foo}}. {% include cat %}.';
        var model = { foo: true };

        return expect(templateEngine.Render(templateString, model)).to.eventually.equal('dogs are nice. Hello World true. cats are ok.');
    });

    it("can render includes using parent's model", function () {
        var templateString = 'I think {% include chicken %}.';
        var model = { disposition: 'awesome' };

        return expect(templateEngine.Render(templateString, model)).to.eventually.equal('I think chickens are awesome.');
    });

//    it('does not blow up with malicious input');
});
