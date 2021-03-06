'use strict';
import {database} from '../database/database.js';
import CrudController from '../common/crudController.js';
import QueryService from './queryService.js';
import authHelper from '../common/authHelper.js';
import current from '../common/current.js';

class QueriesController extends CrudController {
    constructor(app) {
        super('queries', app, new QueryService(database));
    }

    mapRoutes(app) {
        // Map routes
        super.mapRoutes(app); // map the base CrudController routes

        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        this.app.get(`/api/${this.resourceName}/getbynameid/:nameId`, authHelper.isAuthenticated, this.getByNameId.bind(this));
    }

    getByNameId(req, res, next) {
        let queryNameId = req.params.nameId;
        res.set("Content-Type", "application/json");

        this.service.getByNameId(current.context.orgId, queryNameId)
            .then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .catch(err => {
                err.message = 'ERROR: queriesController -> queryService.getByNameId({0}, {1}) - {2}'.format(current.context.orgId, queryNameId, err.message);
                return next(err);
            });
    }

}

export default QueriesController;




