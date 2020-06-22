import chai from 'chai';
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const should = chai.Should();
chai.use(chaiAsPromised);
const testHelper = require('../common/testHelper');

const UserService = require("./userService");
const database = require("../database/database").database;

const testOrgId = testHelper.testOrgId;

describe("UserService CRUD", function () {
    let userService = {};
    let existingUser = {};

    before(function () {
        userService = new UserService(database);
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
        let getByIdPromise = userService.getById(existingUser.id);
        return getByIdPromise.should.eventually.have.property("email").deep.equal(existingUser.email);
    });

    it("can throw error while getting user by Id, if the id is not specified", () => {
        let getByIdPromise = userService.getById();
        return getByIdPromise.should.be.rejectedWith('Incorrect number of arguments passed to UserService.getById');
    });

    it("can get user by email", () => {
        let getByEmailPromise = userService.getByEmail(existingUser.email);
        return getByEmailPromise.should.eventually.have.property("id").deep.equal(existingUser.id);
    });

    it("can create users", () => {
        let user = {
            email: "three@test.com",
            password: "three"
        };

        let createPromise = userService.create(testOrgId, user);

        return createPromise
            .then((doc) => {
                return userService.getById(doc.id)
                    .then((retrievedDoc) => {
                        expect(retrievedDoc).to.have.property('orgId', testOrgId);
                        expect(retrievedDoc).to.have.property('email', user.email);
                        return expect(retrievedDoc).to.have.property('password').not.equal(user.password);
                    });
            });
    });

    it("can throw error while creating user, if orgId and user object is not specified", () => {
        let createPromise = userService.create({});
        return createPromise.should.be.rejectedWith("Incorrect number of arguments passed to UserService.create");
    });

    it("can hash and verify password", () => {
        let password = "test";
        let hashPasswordPromise = userService.hashPassword(password);

        hashPasswordPromise.then(hashedPassword => {
          userService.verifyPassword(password, hashedPassword).then(isMatch => {
            expect(isMatch).to.be.true;
          })
        })
    });

    function deleteAllTestUsers() {
        return database.users.remove({orgId: testOrgId});
    }
});
