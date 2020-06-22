'use strict';
const config = require('./server/config');
import moment from 'moment';

const agendaService = require('./schedules/agendaService.js');
const path = require('path');

global.appRoot = path.resolve(__dirname);
let agenda;

//var jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : [];
const jobTypes = config.jobTypes ? config.jobTypes.split(',') : [];

agendaService((startedAgenda) => {
    agenda = startedAgenda;  // we'll get agenda as soon as it's ready

    jobTypes.forEach(function(type) {
        require('./schedules/jobs/' + type)(agenda);
    });

    // agenda.on('ready', async () => {
//     if (jobTypes.length) {
//         await agenda.start();
//     }
// });

    agenda.on('start', function(job) {
        console.log("Job %s starting", job.attrs.name);
    });

    agenda.on('complete', function(job) {
        console.log(`Job %s finished at ${moment().format('MM-DD-YYYY hh:mm:ss')}`, job.attrs.name);
    });

    agenda.on('success:regenerateJob', function(job) {
        console.log("regenerateJob Success for orgId: %s", job.attrs.data.orgId);
    });

    agenda.on('fail:regenerateJob', function(err, job) {
        console.log("Job failed with error: %s", err.message);
    });

});






