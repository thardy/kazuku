const SchedulingService = require("./SchedulingService");
const chai = require("chai");
const should = chai.Should();
const expect = chai.expect;
const ObjectID = require('mongodb').ObjectID;

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

let testOrgId = '5949fdeff8e794bdbbfd3d85';

describe("SchedulingService", () => {
    let scehdulingService = {};
    
    before(function () {
        schedulingService = new SchedulingService();
    });

    it("schedule regenerateJob for an org", () => {
        return schedulingService.scheduleRegenerateJobForOrg(testOrgId);
    });
});
