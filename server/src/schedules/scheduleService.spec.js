const _ = require("lodash");
const Promise = require("bluebird");
const SchedulingService = require("./scheduleService");
const OrganizationService = require("../organizations/organizationService");
const database = require("../database/database").database;
const chai = require("chai");
const should = chai.Should();
const expect = chai.expect;

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

const testOrgId = 1;

describe("ScheduleService", () => {
    let scheduleService = {};
    let orgService = {};
    let existingOrgs = [];
    let testOrgPrefix = '00TestOrg00-';
    let testSiteId = 1;
    
    before(function() {
        scheduleService = new SchedulingService();
        orgService = new OrganizationService(database);
        let newOrg1 = {
            name: `${testOrgPrefix}Acme Corp`,
            code: `${testOrgPrefix}acmecorp`,
            description: 'A cool company.',
            statusId: 1,
            isMetaOrg: false,
        };
        let newOrg2 = {
            name: `${testOrgPrefix}Org to Update`,
            code: `${testOrgPrefix}updateorg`,
            description: 'A good org to update.',
            statusId: 1,
            isMetaOrg: false,
        };

        return deleteAllTestOrganizations()
            .then((result) => {
                return deleteAllTestSchedules();
            })
            .then(function(result) {
                return database.organizations.insert([newOrg1, newOrg2]);
            })
            .then(function(docs) {
                existingOrgs = docs;
                _.forEach(docs, function(item) {
                    item.id = item._id.toHexString();
                });
                return docs;
            })
            // todo: create test sites for publishing (does publishingTestHelper have anything to help with this stuff?)
            .then((docs) => {
                // create an initial agenda schedule for each of our orgs for testing
                let promises = [];
                docs.forEach((doc) => {
                    let minutes = 3;
                    let siteId = 1;
                    promises.push(scheduleService.scheduleRegenerateJobForOrgSite(doc.id, siteId, minutes, true));
                });
                return Promise.all(promises);
            })
            .then(null, function(error) {
                console.log(error);
                throw error;
            });
    });

    after(function() {
        return deleteAllTestSchedules()
            .then((result) => {
                return deleteAllTestOrganizations();
            });
    });

    it("can get schedules by org", () => {
        return scheduleService.getbyOrgAndSite(existingOrgs[0].id, testSiteId)
            .then((job) => {
                job.attrs.data.should.deep.equal({orgId: existingOrgs[0].id, siteId: testSiteId, test: true});
                return job.attrs.repeatInterval.should.deep.equal('3 minutes');
            });
    });

    it('should update an existing schedule for an org', () => {
        const numMinutes = 29;
        // todo: this isn't updating, it's inserting a new schedule for this orgId
        return scheduleService.scheduleRegenerateJobForOrgSite(existingOrgs[1].id, testSiteId, numMinutes, true)
            .then((result) => {
                return scheduleService.getbyOrgAndSite(existingOrgs[1].id, testSiteId)
            })
            .then((job) => {
                job.attrs.data.should.deep.equal({orgId: existingOrgs[1].id, siteId: testSiteId, test: true});
                return job.attrs.repeatInterval.should.deep.equal(`${numMinutes} minutes`);
            });
    });

    function deleteAllTestOrganizations() {
        return database.organizations.remove({name: { $regex: /^00TestOrg00-/ }});
    }

    function deleteAllTestSchedules() {
        return database.agendaJobs.remove({'data.test': true});
    }
});
