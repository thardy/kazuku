'use strict';
const database = require("../database/database").database;
const pureMongoService = require('../database/pureMongoService');
const CrudController = require("../common/crudController");
const SiteService = require("./siteService");
const authHelper = require('../common/authHelper');
const current = require('../common/current');

class SitesController extends CrudController {
    constructor(app) {
        super('sites', app, new SiteService(database, pureMongoService.db));
    }

}

module.exports = SitesController;




