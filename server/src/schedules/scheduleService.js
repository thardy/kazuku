// const AgendaService = require('./agendaService');
const agendaService = require('./agendaService');
const ObjectId = require('mongodb').ObjectID;

class ScheduleService {
    constructor(database) {
        agendaService((agenda) => {
           this.agenda = agenda;  // we'll get agenda as soon as it's ready
        });
    }

    getbyOrgAndSite(orgId, siteId) {
        return new Promise((resolve, reject) => {
            // this.agendaService.agenda.jobs({name: `regenerateJob`, 'data.orgId': orgId, 'data.siteId': siteId}, (err, jobs) => {
            this.agenda.jobs({name: `regenerateJob`, 'data.orgId': orgId, 'data.siteId': siteId}, (err, jobs) => {
                let job = null;
                if (jobs && jobs.length > 0) {
                    job = jobs[0];
                }
                return resolve(job);
            });
        });
    }

    scheduleRegenerateJobForOrgSite(orgId, siteId, minutes, test = false) {
        // try to get the schedule, if it exists, update it, otherwise create it
        return this.getbyOrgAndSite(orgId, siteId)
            .then((job) => {
                if (job) {
                    // update the existing schedule for this orgId and siteId
                    return new Promise((resolve, reject) => {
                        // test attribute is a hack to be able to designate test jobs for easy deletion in testing
                        job.repeatEvery(`${minutes} minutes`);
                        job.save(resolve(job));
                    });
                }
                else {
                    // create a schedule for this orgId and siteId
                    return new Promise((resolve, reject) => {
                        // test attribute is a hack to be able to designate test jobs for easy deletion in testing
                        // const job = this.agendaService.agenda.create('regenerateJob', {orgId: orgId, siteId: siteId, test: test})
                        const job = this.agenda.create('regenerateJob', {orgId: orgId, siteId: siteId, test: test})
                            .repeatEvery(`${minutes} minutes`);
                        job.save(resolve(job));
                    });
                }
            });
    }
}

module.exports = ScheduleService;

