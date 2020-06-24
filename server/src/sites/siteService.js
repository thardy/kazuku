'use strict';
import config from '../server/config/index.js';
import GenericService from '../common/genericService.js';
import ScheduleService from '../schedules/scheduleService.js';
import current from '../common/current.js';

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

export default SiteService;
