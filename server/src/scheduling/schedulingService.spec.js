const SchedulingService = require("./SchedulingService");
const chai = require("chai");
const should = chai.Should();
const expect = chai.expect;

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

const testOrgId = 1;

describe("SchedulingService", () => {
    const scehdulingService = {};
    
    before(function () {
        schedulingService = new SchedulingService();
    });

    it("schedule regenerateJob for an org", () => {
        return schedulingService.scheduleRegenerateJobForOrg(testOrgId);
    });
});
