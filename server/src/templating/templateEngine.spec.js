var should = require('should');
var TemplateEngine = require('./templateEngine');

describe('TemplateEngine', function() {
    describe('defaults', function() {
        var templateEngine = {};

        before(function() {
            templateEngine = new TemplateEngine({engine: 'swig'});
        });

        it('engine is swig', function() {
            templateEngine.engine.should.equal('swig');
        });

        it('can render using a model', function() {
            var i = 0;
            var templateString = '{% if foo %}Hello World{% endif %}';
            var model = { locals: {foo: true}};

            var output = templateEngine.Render(templateString, model);
            output.should.equal('Hello World');

            model.locals.foo = false;
            output = templateEngine.Render(templateString, model);
            output.should.equal('');
        });

        it('does not blow up with malicious input');

    });
});
