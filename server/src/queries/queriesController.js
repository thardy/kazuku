'use strict';
const database = require("../database/database").database;
const CrudController = require("../common/crudController");
const QueryService = require("./queryService");
const authHelper = require('../common/authHelper');
const current = require('../common/current');

class QueriesController extends CrudController {
    constructor(app) {
        super('queries', app, new QueryService(database));
    }

    mapRoutes(app) {
        // Map routes
        super.mapRoutes(app); // map the base CrudController routes

        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        this.app.get(`/api/${this.resourceName}/getbyname/:name`, authHelper.isAuthenticated, this.getByName.bind(this));
    }

    getByName(req, res, next) {
        let queryName = req.params.name;
        res.set("Content-Type", "application/json");

        this.service.getByName(current.context.orgId, queryName)
            .then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .catch(err => {
                err.message = 'ERROR: queriesController -> queryService.getByName({0}, {1}) - {2}'.format(current.context.orgId, queryName, err.message);
                return next(err);
            });
    }

}

module.exports = QueriesController;




