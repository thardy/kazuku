var _ = require("lodash");
var express = require("express");
var request = require("supertest-as-promised");
var chai = require("chai");
chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));
var should = chai.Should();
var expect = chai.expect;
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

var testHelper = require("../common/testHelper");
var utils = require('../utils/index');

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
        return request(testHelper.apiUrl)
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .then(result => {
            result.body.should.have.property('_id');
            result.body.should.have.property('id');
            result.body.should.have.property("orgId").deep.equal(newUser.orgId);
            result.body.should.have.property("email").deep.equal(newUser.email);
            bcrypt.compareAsync(newUser.password, result.body.password).then(isMatch => {
              expect(isMatch).to.be.true;
            });
        });
    });

    it("should not create a new user if user with same email already exists", () => {
        return request(testHelper.apiUrl)
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
        return request(testHelper.apiUrl)
        .post('/api/users/login')
        .send(user)
        .expect(200)
        .then(result => {
            result.body.user.should.have.property('id');
            result.body.user.should.have.property("email").deep.equal(user.email);
        });
    });

    it("should return unauthenticated if there is no logged in user", () => {
        return request(testHelper.apiUrl)
        .get('/api/users/random-number')
        .expect(401)
        .then(result => {
            result.error.text.should.equal('Unauthenticated');
        });
    });

    xit("should return a user object and a random number I there is a logged in user", () => {
      var user = {
          orgId: testHelper.testOrgId,
          email: "one@test.com",
          password: "one"
      };
      return request(testHelper.apiUrl)
      .post('/api/users/login')
      .send(user)
      .expect(200)
      .then(result => {
        console.log("user logged in...");
      })
      .then(user => {
        console.log("hitting the random-number endpoint...");
        return request(testHelper.apiUrl)
          .get('/api/users/random-number')
          .expect(200)
          .then(result => {
            console.log("yay got the random number =", result);
          });
      });
    });
});
