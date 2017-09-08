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
        // map routes
        app.get(`/api/${this.resourceName}/getallpages`, authHelper.isAuthenticated, this.getAllPages.bind(this));
        app.get(`/api/${this.resourceName}/getbyname/:name`, authHelper.isAuthenticated, this.getByName.bind(this));

        // map the base CrudController routes
        super.mapRoutes(app);
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

    getAllPages(req, res, next) {
        res.set("Content-Type", "application/json");

        // Query mongo for templates that have a url property that is non-null
        this.service.find(current.user.orgId, { "url" : { $ne : null, $exists : true } })
            .then((templates) => {
                if (templates === null) return next();

                return res.status(200).send(templates);
            })
            .catch(err => {
                err.message = 'ERROR: templatesController -> templateService.find({0}, { "url" : { $ne : null, $exists : true } }) - {1}'.format(current.user.orgId, err.message);
                return next(err);
            });
    }

}

module.exports = TemplatesController;



