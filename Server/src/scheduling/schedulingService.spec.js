let SchedulingService = require("./SchedulingService");
let chai = require("chai");
let should = chai.Should();
let expect = chai.expect;

chai.use(require("chai-as-promised"));
chai.use(require('chai-things'));

let testOrgId = 1;

describe("SchedulingService", () => {
    let scehdulingService = {};
    
    before(function () {
        schedulingService = new SchedulingService();
    });

    it("schedule regenerateJob for an org", () => {
        return schedulingService.scheduleRegenerateJobForOrg(testOrgId);
    });
});
