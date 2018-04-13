'use strict';
const config = require('./server/config');
const moment = require('moment');

const agenda = require('./schedules/agenda.js');
const path = require('path');

global.appRoot = path.resolve(__dirname);

//var jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : [];
const jobTypes = config.jobTypes ? config.jobTypes.split(',') : [];

jobTypes.forEach(function(type) {
    require('./schedules/jobs/' + type)(agenda);
});

agenda.on('ready', function() {
    if (jobTypes.length) {
        agenda.start();
    }
});

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


