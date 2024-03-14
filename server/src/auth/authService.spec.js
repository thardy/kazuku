import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
const expect = chai.expect;
const should = chai.Should();
chai.use(chaiAsPromised);
import testHelper from '../common/testHelper.js';

import AuthService from './authService.js';
import {database} from '../database/database.js';

const testOrgId = testHelper.testOrgId;

describe("AuthService CRUD", function () {
    let authService = {};
    let existingUser = {};

    before(function () {
        authService = new AuthService(database);
        let newUser = {
            orgId: testOrgId,
            email: "one@test.com",
            password: "one"
        };

        return deleteAllTestUsers()
            .then(function(result) {
                return database.users.insert(newUser);
            })
            .then(function(doc) {
                existingUser = doc;
                existingUser.id = existingUser._id.toHexString();
                return doc;
            })
            .then(null, function(error) {
                console.log(error);
                throw error;
            });
    });

    after(function () {
        return deleteAllTestUsers();
    });

    it("can get user by Id", () => {
        let getByIdPromise = authService.getUserById(existingUser.id);
        return getByIdPromise.should.eventually.have.property("email").deep.equal(existingUser.email);
    });

    it("can throw error while getting user by Id, if the id is not specified", () => {
        let getByIdPromise = authService.getUserById();
        return getByIdPromise.should.be.rejectedWith('Incorrect number of arguments passed to AuthService.getUserById');
    });

    it("can get user by email", () => {
        let getByEmailPromise = authService.getUserByEmail(existingUser.email);
        return getByEmailPromise.should.eventually.have.property("id").deep.equal(existingUser.id);
    });

    it("can create users", () => {
        let user = {
            email: "three@test.com",
            password: "three"
        };

        let createPromise = authService.createUser(testOrgId, user);

        return createPromise
            .then((doc) => {
                return authService.getById(testOrgId, doc.id)
                    .then((retrievedDoc) => {
                        expect(retrievedDoc).to.have.property('orgId', testOrgId);
                        expect(retrievedDoc).to.have.property('email', user.email);
                        return expect(retrievedDoc).to.have.property('password').not.equal(user.password);
                    });
            });
    });

    it("can throw error while creating user, if orgId and user object is not specified", () => {
        let createPromise = authService.createUser({});
        return createPromise.should.be.rejectedWith("Incorrect number of arguments passed to AuthService.createUser");
    });

    it("can hash and verify password", () => {
        let password = "test";
        let hashPasswordPromise = authService.hashPassword(password);

        hashPasswordPromise.then(hashedPassword => {
          authService.verifyPassword(password, hashedPassword).then(isMatch => {
            expect(isMatch).to.be.true;
          })
        })
    });

    function deleteAllTestUsers() {
        return database.users.remove({orgId: testOrgId});
    }
});
