var _ = require("lodash");
var express = require("express");
var request = require("supertest-as-promised");
var chai = require("chai");
var should = chai.Should();
var expect = chai.expect;
var moment = require("moment");
var Query = require("rql/query").Query;
// todo: consider moving this into a more global spot before running all api-related tests.  See http://beletsky.net/2014/03/testable-apis-with-node-dot-js.html
//  or split mocha tests up somehow, preferably by tag or somesuch instead of by location.
//  Perhaps just leave in each spec until Mocha tagging api is completed, and use that to split up api and non-api test runs.
// Update: I'm currently using grep to run api tests and it's working, but it doesn't address loading this in every spec.
var app = require('../../bin/www'); // This starts up the api server (I'm assuming it shuts down when mocha is done)

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

describe("ApiTests", function () {
    var testOrgId = 1;
    var testContentType1 = 'testType1';
    var apiUrl = 'http://localhost:3000';

    describe("customDataController", function () {

        describe("when authorized", function () {
            describe("getAll", function () {
                it("should return all customData for a given org and contentType", function () {
                    return request(apiUrl)
                        .get('/api/customData/type_1_0')
                        .expect(200);
                });
            });
            describe("getById", function () {

            });
            describe("create", function () {
                it("should create a new custom data document", function () {
                    var someString = 'Thursday';
                    var someNum = 22;
                    var body = {
                        orgId: testOrgId,
                        contentType: testContentType1,
                        someString: someString,
                        someNum: someNum
                    };

                    return request(apiUrl)
                        .post('/api/customData/{0}'.format(testContentType1))
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

