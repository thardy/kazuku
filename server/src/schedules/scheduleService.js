// import agendaService from './agendaService.js';
import agendaService from './agendaService.js';
import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectID;

class ScheduleService {
    constructor(database) {
        agendaService((agenda) => {
           this.agenda = agenda;  // we'll get agenda as soon as it's ready
        });
    }

    getbyOrgAndSite(orgId, siteId) {
        return this.agenda.jobs({name: `regenerateJob`, 'data.orgId': orgId, 'data.siteId': siteId})
            .then((jobs) => {
                let job = null;
                if (jobs && jobs.length > 0) {
                    job = jobs[0];
                }
                return Promise.resolve(job);
            });
        // return new Promise((resolve, reject) => {
        //     // this.agendaService.agenda.jobs({name: `regenerateJob`, 'data.orgId': orgId, 'data.siteId': siteId}, (err, jobs) => {
        //     this.agenda.jobs({name: `regenerateJob`, 'data.orgId': orgId, 'data.siteId': siteId}, (err, jobs) => {
        //         let job = null;
        //         if (jobs && jobs.length > 0) {
        //             job = jobs[0];
        //         }
        //         return resolve(job);
        //     });
        // });
    }

    scheduleRegenerateJobForOrgSite(orgId, siteId, minutes, test = false) {
        // try to get the schedule, if it exists, update it, otherwise create it
        return this.getbyOrgAndSite(orgId, siteId)
            .then((job) => {
                if (job) {
                    // update the existing schedule for this orgId and siteId
                    job.repeatEvery(`${minutes} minutes`);
                    return job.save();

                    // return new Promise((resolve, reject) => {
                    //     // test attribute is a hack to be able to designate test jobs for easy deletion in testing
                    //     job.repeatEvery(`${minutes} minutes`);
                    //     return job.save(resolve(job));
                    // });
                }
                else {
                    // create a schedule for this orgId and siteId
                    const newJob = this.agenda.create('regenerateJob', {orgId: orgId, siteId: siteId, test: test});
                    return newJob.repeatEvery(`${minutes} minutes`).save();

                    // return new Promise((resolve, reject) => {
                    //     // test attribute is a hack to be able to designate test jobs for easy deletion in testing
                    //     // const job = this.agendaService.agenda.create('regenerateJob', {orgId: orgId, siteId: siteId, test: test})
                    //     const newJob = this.agenda.create('regenerateJob', {orgId: orgId, siteId: siteId, test: test})
                    //         .repeatEvery(`${minutes} minutes`);
                    //     return newJob.save(resolve(job));
                    // });
                }
            });
    }
}

export default ScheduleService;

