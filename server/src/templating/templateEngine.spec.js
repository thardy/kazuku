var TemplateEngine = require('./templateEngine');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;

chai.use(chaiAsPromised);

describe('TemplateEngine', function() {
    var templateEngine = {};
    var engineType = 'liquid';

    before(function() {
        templateEngine = new TemplateEngine({engineType: engineType});
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

    it('can use a CustomFileSystem', function () {
        var templateString = '{% include dog %}. Hello World {{foo}}. {% include cat %}.';
        var model = { foo: true };

        return expect(templateEngine.Render(templateString, model)).to.eventually.equal('dogs are nice. Hello World true. cats are ok.');
    });

    it("can render includes using a model", function () {
        var templateString = 'I think {% include chicken %}.';
        var model = { disposition: 'awesome' };

        return expect(templateEngine.Render(templateString, model)).to.eventually.equal('I think chickens are awesome.');
    });

//    it("can embed templates");
//
//    it('does not blow up with malicious input');
});
