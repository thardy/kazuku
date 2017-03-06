"use strict";
var database = require("../database/database").database;
var CrudController = require("../common/crudController");
var TemplateService = require("./templateService");

class TemplatesController extends CrudController {
    constructor(app) {
        super('templates', app, new TemplateService(database));

        this.mapAdditionalRoutes();
    }

    mapAdditionalRoutes() {
        // Map routes
        this.mapRoutes(); // map the base CrudController routes

        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        this.app.get(`/api/${this.resourceName}/getbyname/:name`, this.getByName.bind(this));
    }

    getByName(req, res, next) {
        let templateName = req.params.name;
        res.set("Content-Type", "application/json");

        this.service.getTemplate(this.orgId, templateName)
            .then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .catch(err => {
                err.message = 'ERROR: templatesController -> templateService.getTemplate({0}, {1}) - {2}'.format(this.orgId, templateName, err.message);
                return next(err);
            });
    }

}

module.exports = TemplatesController;



