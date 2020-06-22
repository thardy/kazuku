'use strict';
import config from '../server/config/index.js';
const GenericService = require('../common/genericService');
const ScheduleService = require('../schedules/scheduleService');
const current = require('../common/current');

class SiteService extends GenericService {
    constructor(database) {
        super(database, 'sites');
        this.scheduleService = new ScheduleService();
    }

    validate(doc) {
        if (doc.code && doc.name) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return 'Need code and name';
        }
    }

    onAfterCreate(orgId, site) {
        // create initial publish schedule for this site
        return this.scheduleService.scheduleRegenerateJobForOrgSite(current.context.orgId, site.id, config.siteDefaults.defaultRegenerationInterval);
    }

}

module.exports = SiteService;
