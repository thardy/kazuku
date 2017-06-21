const agenda = require("./agenda");


class SchedulingService {
    constructor() {}

    scheduleRegenerateJobForOrg(orgId) {
        agenda.every('1 minutes', 'regenerateJob', {orgId: orgId.toString()});
    }
}

module.exports = SchedulingService;
