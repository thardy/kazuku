var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var should = chai.Should();
chai.use(chaiAsPromised);

var UserService = require("./userService");
var database = require("../database/database").database;

describe("UserService CRUD", function () {
    var userService = {};
    var existingUser = {};
    var testOrgId = 1;

    before(function () {
        userService = new UserService(database);
        var newUser = {
            orgId: testOrgId,
            email: "one@test.com",
            password: "one"
        };

        return deleteAllTestSchema()
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
        return deleteAllTestSchema();
    });

    it("can get user by Id", () => {
        var getByIdPromise = userService.getById(existingUser.id);
        return getByIdPromise.should.eventually.have.property("email").deep.equal(existingUser.email);
    });

    it("can throw error while getting user by Id, if the id is not specified", () => {
        userService.getById.should.throw(Error, "Incorrect number of arguments passed to UserService.getById");
    });

    it("can get user by email", () => {
        var getByEmailPromise = userService.getByEmail(existingUser.email);
        return getByEmailPromise.should.eventually.have.property("id").deep.equal(existingUser.id);
    });

    it("can create user", () => {
        var user = {
            email: "three@test.com",
            password: "three"
        };

        var createUserPromise = userService.create(testOrgId, user);

        return createUserPromise.should.eventually.have.property("orgId").equal(testOrgId)
                                               and.have.property("email").equal(user.email)
                                               and.have.property("password").not.equal(user.password);
    });

    it("can throw error while creating user, if orgId and user object is not specified", () => {
        userService.create.should.throw(Error, "Incorrect number of arguments passed to UserService.create");
    });

    it("can hash and verify password", () => {
        let password = "test";
        var hashPasswordPromise = userService.hashPassword(password);

        hashPasswordPromise.then(hashedPassword => {
          userService.verifyPassword(password, hashedPassword).then(isMatch => {
            expect(isMatch).to.be.true;
          })
        })
    });

    function deleteAllTestSchema() {
        return database.users.remove({orgId: testOrgId});
    }
});
