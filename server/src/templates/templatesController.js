"use strict";
const database = require("../database/database").database;
const CrudController = require("../common/crudController");
const TemplateService = require("./templateService");
const authHelper = require('../common/authHelper');
const current = require('../common/current');

class TemplatesController extends CrudController {
    constructor(app) {
        super('templates', app, new TemplateService(database));
    }

    mapRoutes(app) {
        // Map routes
        super.mapRoutes(app); // map the base CrudController routes

        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        app.get(`/api/${this.resourceName}/getbyname/:name`, authHelper.isAuthenticated, this.getByName.bind(this));
    }

    getByName(req, res, next) {
        let templateName = req.params.name;
        res.set("Content-Type", "application/json");

        this.service.getTemplate(current.user.orgId, templateName)
            .then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .catch(err => {
                err.message = 'ERROR: templatesController -> templateService.getTemplate({0}, {1}) - {2}'.format(current.user.orgId, templateName, err.message);
                return next(err);
            });
    }

}

module.exports = TemplatesController;



