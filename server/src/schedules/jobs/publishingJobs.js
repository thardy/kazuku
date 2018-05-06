const database = require("../../database/database").database;
const PublishingService = require('../../publishing/publishingService');
require('zone.js/dist/zone-node.js');

module.exports = function(agenda) {
    const publishingService = new PublishingService(database);

    agenda.define('regenerateJob', {lockLifetime: 45000}, function(job, done) {
        // some components reach out to the current Zone.context to get the orgId, so set it here
        const fullContext = { user: {firstName: 'System', lastName: 'User'}, orgId: job.attrs.data.orgId };
        Zone.current.context = fullContext;
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
