'use strict';
const _ = require("lodash");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const should = chai.Should();
chai.use(chaiAsPromised);

const OrganizationService = require("./organizationService");
const database = require("../database/database").database;

describe("OrganizationService CRUD", function () {
    let orgService = {};
    let existingOrgs = [];
    let testOrgPrefix = '00TestOrg00-';

    before(function () {
        orgService = new OrganizationService(database);
        let newOrg1 = { name: `${testOrgPrefix}Acme Corp`, code: `${testOrgPrefix}acmecorp`, description: 'A cool company.', statusId: 1, isMetaOrg: 0 };
        let newOrg2 = { name: `${testOrgPrefix}Org to Update`, code: `${testOrgPrefix}updateorg`, description: 'A good org to update.', statusId: 1, isMetaOrg: 0 };

        return deleteAllTestOrganizations()
            .then(function(result) {
                return database.organizations.insert([newOrg1, newOrg2]);
            })
            .then(function(docs) {
                existingOrgs = docs;
                _.forEach(docs, function (item) {
                    item.id = item._id.toHexString();
                });
                return docs;
            })
            .then(null, function(error) {
                console.log(error);
                throw error;
            });
    });

    after(function () {
        return deleteAllTestOrganizations();
    });

    it("can get orgs by Id", () => {
        let getByIdPromise = orgService.getById(existingOrgs[0].id);
        return getByIdPromise.should.eventually.have.property("code").deep.equal(existingOrgs[0].code);
    });

    it("can throw error while getting org by Id, if the id is not specified", () => {
        let getByIdPromise = orgService.getById();
        getByIdPromise.should.throw(Error, "Incorrect number of arguments passed to OrganizationService.getById");
    });

    it("can get orgs by code", () => {
        let getByCodePromise = orgService.getByCode(existingOrgs[0].code);
        return getByCodePromise.should.eventually.have.property("id").deep.equal(existingOrgs[0].id);
    });

    it("can create orgs", () => {
        let newOrg = { name: `${testOrgPrefix}My New Org`, code: `${testOrgPrefix}myneworg`, description: 'Just a test.', statusId: 1, isMetaOrg: 0 };

        let createOrgPromise = orgService.create(newOrg);

        return createOrgPromise.should.eventually.have.property("name").equal(newOrg.name)
            .and.have.property('code').equal(newOrg.code);
    });

    it("can throw error while creating org, if name and code is not specified", () => {
        let createPromise = orgService.create({});
        return createPromise.should.throw(Error, 'Need name and code to create organization');
    });

    it("can update orgs by id", function () {
        let updatedOrgDescription = 'new description';
        let updatedStatusId = 4;
        let theUpdatedOrg = {
            description: updatedOrgDescription,
            statusId: updatedStatusId
        };

        let updateByIdPromise = orgService.updateById(existingOrgs[1].id, theUpdatedOrg);

        return updateByIdPromise.then(function(result) {
            result.nModified.should.equal(1);

            // verify org was updated
            let getByIdPromise = orgService.getById(existingOrgs[1].id);

            return getByIdPromise.should.eventually.have.property('description').equal(updatedDescription)
                .and.have.property('statusId').equal(updatedStatusId);
        });
    });

    it("can delete orgs by id", function () {
        let newOrg = { name: `${testOrgPrefix}Org to Delete`, code: `${testOrgPrefix}orgToDelete`, description: 'An org to delete.', statusId: 1, isMetaOrg: 0 };

        let createPromise = orgService.create(newOrg);

        return createPromise.then((doc) => {
            return orgService.delete(doc.id).then(function(result) {
                return orgService.getById(doc.id).then(function(retrievedDoc) {
                    return expect(retrievedDoc).to.equal(null);
                });
            });
        });
    });

    function deleteAllTestOrganizations() {
        return database.organizations.remove({name: { $regex: /^00TestOrg00-/ }});
    }
});