var _ = require("lodash");
var express = require("express");
var request = require("supertest-as-promised");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;
var moment = require("moment");
var Query = require("rql/query").Query;
var testHelper = require("../common/testHelper");

// todo: consider moving this into a more global spot before running all api-related tests.  See http://beletsky.net/2014/03/testable-apis-with-node-dot-js.html
//  or split mocha tests up somehow, preferably by tag or somesuch instead of by location.
//  Perhaps just leave in each spec until Mocha tagging api is completed, and use that to split up api and non-api test runs.
// Update: I'm currently using grep to run api tests and it's working, but it doesn't address loading this in every spec.
var app = require('../../bin/www'); // This starts up the api server (I'm assuming it shuts down when mocha is done)

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

describe("ApiTests", function () {

    before(function () {
        // Insert some docs to be present before all tests start
        return testHelper.setupTestProducts();
    });

    after(function () {
        // Remove everything we created
        return testHelper.deleteAllTestProducts();
    });

    describe("customDataController", function () {

        describe("when authorized", function () {
            describe("getAll", function () {
                it("should return all customData for a given org and contentType", function () {
                    return request(testHelper.apiUrl)
                        .get('/api/customData/{0}'.format(testHelper.testProductsContentType))
                        .expect(200)
                        .then(function (result) {
                            result.body.length.should.equal(3);
                            var product = _.find(result.body, function(item) {
                                return item.name === testHelper.newProduct1.name;
                            });
                            product.quantity.should.equal(testHelper.newProduct1.quantity);
                        });
                });
            });
            describe("getById", function () {

            });
            describe("create", function () {
                it("should create a new custom data document", function () {
                    var someString = 'Thursday';
                    var someNum = 22;
                    var body = {
                        orgId: testHelper.testOrgId,
                        contentType: testHelper.testProductsContentType,
                        someString: someString,
                        someNum: someNum
                    };

                    return request(testHelper.apiUrl)
                        .post('/api/customData/{0}'.format(testHelper.testProductsContentType1))
                        .send(body)
                        .expect(201)
                        .then(function(result) {
                            result.body.should.have.property('_id');
                            result.body.should.have.property('id');
                            result.body.someString.should.equal(someString);
                            result.body.someNum.should.equal(someNum);
                        });
                });

            });
            describe("update", function () {

            });
            describe("delete", function () {

            });
        });
    });
});

