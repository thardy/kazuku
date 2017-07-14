'use strict';
const database = require("../database/database").database;
const CrudController = require("../common/crudController");
const OrganizationService = require("./organizationService");

class OrganizationsController extends CrudController {
    constructor(app) {
        super('organizations', app, new OrganizationService(database));

        this.mapAdditionalRoutes();
    }

    mapAdditionalRoutes() {
        // Map routes
        this.mapRoutes(); // map the base CrudController routes

        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        this.app.get(`/api/${this.resourceName}/getbyname/:name`, this.getByName.bind(this));
    }

    getByName(req, res, next) {
        let orgName = req.params.name;
        res.set("Content-Type", "application/json");

        this.service.getByName(orgName)
            .then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .catch(err => {
                err.message = 'ERROR: organizationsController -> organizationService.getByName({0}, {1}) - {2}'.format(orgName, err.message);
                return next(err);
            });
    }

}

module.exports = OrganizationsController;
