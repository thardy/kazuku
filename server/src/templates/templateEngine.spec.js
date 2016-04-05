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

describe('TemplateEngine basics', function() {
    var templateEngine = {};
    var engineType = 'liquid';

    before(function() {
        var fakeTemplateRepo = new FakeTemplateRepo();
        templateEngine = new TemplateEngine({engineType: engineType, templateRepo: fakeTemplateRepo});
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

    it("can render includes using a model", function () {
        var templateString = 'I think {% include chicken %}.';
        var model = { disposition: 'awesome' };

        return expect(templateEngine.Render(templateString, model)).to.eventually.equal('I think chickens are awesome.');
    });

//    it('does not blow up with malicious input');
});
