'use strict';
const database = require("../database/database").database;
const CrudController = require("../common/crudController");
const SiteService = require("./sitesService");
const authHelper = require('../common/authHelper');
const current = require('../common/current');

class SitesController extends CrudController {
    constructor(app) {
        super('sites', app, new SiteService(database));
    }

}

module.exports = SitesController;



