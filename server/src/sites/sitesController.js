'use strict';
import {database} from '../database/database.js';
import CrudController from '../common/crudController.js';
import SiteService from './siteService.js';
import authHelper from '../common/authHelper.js';
import current from '../common/current.js';

class SitesController extends CrudController {
    constructor(app) {
        super('sites', app, new SiteService(database));
    }

}

export default SitesController;




