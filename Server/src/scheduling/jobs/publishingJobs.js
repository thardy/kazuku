let database = require("../../database/database").database;
let PublishingService = require('../../publishing/publishingService');

module.exports = function(agenda) {
    let publishingService = new PublishingService(database);

    agenda.define('regenerateJob', {lockLifetime: 45000}, function(job, done) {
        return publishingService.regenerateItems(job.attrs.data.orgId, job.attrs.data.siteId)
            .then((result) => {
                done();
            })
            .catch((error) => {
                done(error);
            });

    });

    // agenda.define('anotherPublishingJob'), function(job, done) {
    //     "use strict";
    //     return theThingToDo(job.attrs.data.someParm)
    //         .then((result) => {
    //             done();
    //         })
    //         .catch((error) => {
    //             done(error);
    //         });
    // });

};
