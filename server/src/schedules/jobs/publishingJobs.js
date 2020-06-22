import {database} from '../../database/database.js';
const PublishingService = require('../../publishing/publishingService');
import zone from 'zone.js/dist/zone-node.js';

module.exports = function(agenda) {
    const publishingService = new PublishingService(database);

    agenda.define('regenerateJob', {lockLifetime: 45000}, function(job, done) {
        // some components reach out to the current Zone.context to get the orgId, so set it here
        const fullContext = { user: {firstName: 'System', lastName: 'User'}, orgId: job.attrs.data.orgId };
        Zone.current.context = fullContext;
        return publishingService.regenerateItems(job.attrs.data.orgId, job.attrs.data.siteId)
            .then((regenerateResults) => {
                if (regenerateResults.length > 0) {
                    let consoleOutput = 'Regenerated the following pages: ';
                    for (let result of regenerateResults) {
                        if (result.templateUpdateResult && result.templateUpdateResult.ok) {
                            consoleOutput += result.pageName + ', ';
                        }
                    }

                    console.log(consoleOutput);
                }
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
