'use strict';

import Promise from 'bluebird';
var TemplateEngine = require('./templateEngine');
import QueryService from '../queries/queryService.js';
import sinon from 'sinon';
import _ from 'lodash';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
import testHelper from '../common/testHelper.js';

chai.use(chaiAsPromised);

const testOrgId = testHelper.testOrgId;

let partialWithModelQuery = {
    name: 'partialWithModelQuery',
    products: 'query(top_5_products)',
    template: "<ul>{% for product in products %}<li>{{product.name}}</li>{% endfor %}</ul>"
};

var FakeTemplateRepo = function() {
    var templateRepo = {};

    var templateObjects = [];
    templateObjects.push({
        orgId: testOrgId,
        name: 'master',
        nameId: 'master',
        template: "<header>I'm the header</header>{{ content }}<footer>I'm the footer</footer>"
    });
    templateObjects.push({
        orgId: testOrgId,
        name: 'masterWithModel',
        nameId: 'master-with-model',
        title: 'Master Title',
        favoriteNumber: 11,
        template: "<header>I'm the header. {{title}}-{{favoriteNumber}}-{{favoriteColor}}</header>{{ content }}<footer>I'm the footer</footer>"
    });
    templateObjects.push({
        orgId: testOrgId,
        name: 'dog',
        nameId: 'dog',
        template: "dogs are nice"
    });
    templateObjects.push({
        orgId: testOrgId,
        name: 'cat',
        nameId: 'cat',
        template: "cats are ok"
    });
    templateObjects.push({
        orgId: testOrgId,
        name: 'chicken',
        nameId: 'chicken',
        template: "chickens are {{disposition}}"
    });
    templateObjects.push({
        orgId: testOrgId,
        name: 'partialWithModel',
        nameId: 'partial-with-model',
        title: 'Default Title',
        template: "title is {{title}}"
    });
    templateObjects.push(partialWithModelQuery);

    // getTemplate returns a templateObject
    templateRepo.getTemplate = function(orgId, templateNameId) {
        var resolver = Promise.defer();
        var foundTemplateObject = _.clone(_.find(templateObjects, {orgId: orgId, nameId: templateNameId}));
        setTimeout(function () {
            resolver.resolve(foundTemplateObject);
        }, 100);
        return resolver.promise;
    };

    return templateRepo;
};

describe('TemplateEngine basics', function() {
    let templateEngine = {};
    let engineType = 'liquid';
    let fakeQueryService = {};

    before(function() {
        let fakeTemplateRepo = new FakeTemplateRepo();

        let QueryServiceStub = sinon.spy(function() {
            return sinon.createStubInstance(QueryService);
        });
        fakeQueryService = new QueryServiceStub();
        // returned result isn't used, the function is just expected to alter the model passed in, so empty Promise result is fine.
        fakeQueryService.resolveQueryPropertiesOnModel.returns(Promise.resolve(''));

        //templateEngine = new TemplateEngine({engineType: engineType, getTemplate: fakeTemplateRepo.getTemplate.bind(fakeTemplateRepo)});
        templateEngine = new TemplateEngine({
            engineType: engineType,
            getTemplate: fakeTemplateRepo.getTemplate.bind(fakeTemplateRepo),
            queryService: fakeQueryService, // templateEngine needs this to resolve queries on models
            orgId: testOrgId
        });
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
        var templateString = "{% include 'dog' %}. Hello World {{foo}}. {% include 'cat' %}.";
        var model = { foo: true };

        return expect(templateEngine.Render(templateString, model)).to.eventually.equal('dogs are nice. Hello World true. cats are ok.');
    });

    it("can render includes using parent's model", function () {
        var templateString = "I think {% include 'chicken' %}.";
        var model = { disposition: 'awesome' };

        return expect(templateEngine.Render(templateString, model)).to.eventually.equal('I think chickens are awesome.');
    });

    it("can render includes with their own model", function () {
        var templateString = "<p>{% include 'partial-with-model' %}</p>";
        var model = {};

        return expect(templateEngine.Render(templateString, model)).to.eventually.equal('<p>title is Default Title</p>');
    });

    it("can render includes with declared parameters", function () {
        var templateString = "<p>{% include 'partial-with-model', title: 'Hashed Title' %}</p>";
        var model = {};

        return expect(templateEngine.Render(templateString, model)).to.eventually.equal('<p>title is Hashed Title</p>');
    });

    it("can have outer template model override included template's model", function () {
        var templateString = "<p>{% include 'partial-with-model' %}</p>";
        var model = { title: 'Parent Title' };

        return expect(templateEngine.Render(templateString, model)).to.eventually.equal('<p>title is Parent Title</p>');
    });

    // it("resolves queries on include with templateObject model", function () {
    //     var templateString = "<p>{% include 'partial-with-model-query' %}</p>";
    //     var model = {};
    //
    //     // How can I change a passed-in argument with sinon???  I need to change the model they pass in to replace
    //     //  the products property with an array of products.
    //     fakeQueryService.resolveQueryPropertiesOnModel.withArgs(1, partialWithModelQuery).returns(Promise.resolve(''));
    //
    //     return expect(templateEngine.Render(templateString, model)).to.eventually.equal('<p>title is Parent Title</p>');
    // });

//    it('does not blow up with malicious input');
});
