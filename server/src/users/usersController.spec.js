const _ = require("lodash");
const express = require("express");
const app = require('../server');
const request = require("supertest");
const chai = require("chai");
chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));
const should = chai.Should();
const expect = chai.expect;
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

const testHelper = require("../common/testHelper");
const utils = require('../utils/index');

describe("ApiTests", function () {
    describe("UsersControllerTest", () => {

        before(() => {
            return testHelper.setupTestUsers();
        });

        after(() => {
            return testHelper.deleteAllTestUsers();
        });

        it("should create a new user", () => {
            var newUser = {
                orgId: testHelper.testOrgId,
                email: "test@test.com",
                password: "test"
            };
            return request(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .then(result => {
                    result.body.should.have.property('_id');
                    result.body.should.have.property('id');
                    result.body.should.have.property("orgId").deep.equal(newUser.orgId);
                    result.body.should.have.property("email").deep.equal(newUser.email);
                });
        });

        it("should not create a new user if user with same email already exists", () => {
            return request(app)
                .post('/api/users')
                .send(testHelper.newUser1)
                .expect(409)
                .then(result => {
                    result.body.should.have.property('Errors').deep.equal(['Duplicate Key Error']);
                });
        });

        it("should log the user in if correct credentials are given", () => {
            var user = {
                orgId: testHelper.testOrgId,
                email: "one@test.com",
                password: "one"
            };
            return request(app)
                .post('/api/users/login')
                .send(user)
                .expect(200)
                .then(result => {
                    result.body.user.should.have.property('id');
                    result.body.user.should.have.property("email").deep.equal(user.email);
                });
        });

        it("should return unauthenticated if there is no logged in user", () => {
            return request(app)
                .get('/api/users/random-number')
                .expect(401)
                .then(result => {
                    result.error.text.should.equal('Unauthenticated');
                });
        });

        xit("should return a user object and a random number I there is a logged in user", () => {
            // todo: Doesn't currently work.  Alter to use something like https://github.com/shaunc/supertest-session-as-promised
            //  in order to use supertest successfully with passport sessions.
            var user = {
                orgId: testHelper.testOrgId,
                email: "one@test.com",
                password: "one"
            };
            return request(app)
                .post('/api/users/login')
                .send(user)
                .expect(200)
                .then(result => {
                    console.log("user logged in...");
                })
                .then(user => {
                    console.log("hitting the random-number endpoint...");
                    return request(app)
                        .get('/api/users/random-number')
                        .expect(200)
                        .then(result => {
                            console.log("yay got the random number =", result);
                        });
                });
        });
    });
});