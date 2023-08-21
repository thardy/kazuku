import _ from 'lodash';
import Promise from 'bluebird';
import SchedulingService from './scheduleService.js';
import OrganizationService from '../organizations/organizationService.js';
import {database} from '../database/database.js';
import pureMongoService from '../database/pureMongoService.js';
import SchemaService from '../server/graphQL/schemaService.js';
import chai from 'chai';
const should = chai.Should();
const expect = chai.expect;
import testHelper from '../common/testHelper.js';

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import chaiThings from 'chai-things';
chai.use(chaiThings);

const testOrgId = testHelper.testOrgId;

describe("ScheduleService", () => {
    let scheduleService = {};
    let orgService = {};
    let existingOrgs = [];
    let testOrgPrefix = '00TestOrg00-';
    let testSiteId = 1;

    before(async () => {
        //await pureMongoService.connectDb();
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
        let newOrg3 = {
            name: `${testOrgPrefix}Org without an intial schedule`,
            code: `${testOrgPrefix}needsSchedule`,
            description: 'A good org to create a schedule for.',
            statusId: 1,
            isMetaOrg: false,
        };

        return deleteAllTestOrganizations()
            .then((result) => {
                return deleteAllTestSchedules();
            })
            .then(function(result) {
                return database.organizations.insert([newOrg1, newOrg2, newOrg3]);
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
                    // don't create a schedule for org3
                    if (doc.id !== existingOrgs[2].id) {
                        promises.push(scheduleService.scheduleRegenerateJobForOrgSite(doc.id, siteId, minutes, true));
                        //promises.push(new Promise.resolve(null));
                    }
                });
                return Promise.all(promises);
            })
            .then(null, function(error) {
                console.log(error);
                throw error;
            });
    });

    after(() => {
        return deleteAllTestSchedules()
            .then((result) => {
                return deleteAllTestOrganizations();
            });
    });

    it("can get schedules by org", () => {
        const orgId = existingOrgs[0].id;
        return scheduleService.getbyOrgAndSite(orgId, testSiteId)
            .then((job) => {
                job.attrs.data.should.deep.equal({orgId: orgId, siteId: testSiteId, test: true});
                return job.attrs.repeatInterval.should.deep.equal('3 minutes');
            });
    });

    it('should create a new schedule for an org', () => {
        const numMinutes = 10;
        const orgId = existingOrgs[2].id;
        return scheduleService.scheduleRegenerateJobForOrgSite(orgId, testSiteId, numMinutes, true)
        .then((result) => {
            return scheduleService.getbyOrgAndSite(orgId, testSiteId)
        })
        .then((job) => {
            job.attrs.data.should.deep.equal({orgId: orgId, siteId: testSiteId, test: true});
            return job.attrs.repeatInterval.should.deep.equal(`${numMinutes} minutes`);
        });
    });

    it('should update an existing schedule for an org', () => {
        const numMinutes = 29;
        const orgId = existingOrgs[1].id;
        return scheduleService.scheduleRegenerateJobForOrgSite(orgId, testSiteId, numMinutes, true)
            .then((result) => {
                return scheduleService.getbyOrgAndSite(orgId, testSiteId)
            })
            .then((job) => {
                job.attrs.data.should.deep.equal({orgId: orgId, siteId: testSiteId, test: true});
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
