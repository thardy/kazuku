import _ from 'lodash';
import config from '../server/config/index.js';
import app from '../server.js';
import supertest from 'supertest';
const request = supertest(`http://${config.hostname}:${config.port}`);
import chai from 'chai';
chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));
const should = chai.Should();
const expect = chai.expect;
import Promise from 'bluebird';
import bcryptNodejs from 'bcrypt-nodejs';
const bcrypt = Promise.promisifyAll(bcryptNodejs);

import testHelper from '../common/testHelper.js';
const utils = require('../utils/index');

describe("ApiTests", function () {
    let server = {};

    before(() => {
        // start express server
        server = app.listen(config.port, () => {
            console.log(`kazuku server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
        });
    });

    after(() => {
        // shutdown express server
        server.close();
    });

    describe("UsersControllerTest", () => {
        let authCookie = {};

        before(function () {
            return request
                .post('/api/users/login')
                .send({
                    email: 'admin',
                    password: 'test'
                })
                .expect(200)
                .then(response => {
                    // todo: look for the auth cookie
                    const cookies = response.header['set-cookie'];
                    if (cookies && cookies.length > 0) {
                        authCookie = cookies[0]
                    }
                    return response;
                });
        });

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
            return request
                .post('/api/users')
                .set('Cookie', [authCookie])
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
            return request
                .post('/api/users')
                .set('Cookie', [authCookie])
                .send(testHelper.newUser1)
                .expect(409)
                .then(result => {
                    result.body.should.have.property('errors').deep.equal(['Duplicate Key Error']);
                });
        });

        it("should log the user in if correct credentials are given", () => {
            var user = {
                orgId: testHelper.testOrgId,
                email: "one@test.com",
                password: "one"
            };
            return request
                .post('/api/users/login')
                .set('Cookie', [authCookie])
                .send(user)
                .expect(200)
                .then(result => {
                    result.body.user.should.have.property('id');
                    result.body.user.should.have.property("email").deep.equal(user.email);
                });
        });

        it("should return unauthenticated if there is no logged in user", () => {
            return request
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
            return request
                .post('/api/users/login')
                .set('Cookie', [authCookie])
                .send(user)
                .expect(200)
                .then(result => {
                    console.log("user logged in...");
                })
                .then(user => {
                    console.log("hitting the random-number endpoint...");
                    return request
                        .get('/api/users/random-number')
                        .set('Cookie', [authCookie])
                        .expect(200)
                        .then(result => {
                            console.log("yay got the random number =", result);
                        });
                });
        });
    });
});