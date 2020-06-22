'use strict';
const database = require("../database/database").database;
const CrudController = require("../common/crudController");
const SiteService = require("./siteService");
const authHelper = require('../common/authHelper');
import current from '../common/current.js';

class SitesController extends CrudController {
    constructor(app) {
        super('sites', app, new SiteService(database));
    }

}

module.exports = SitesController;




