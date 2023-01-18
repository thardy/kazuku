'use strict';
import {database} from '../database/database.js';
import CrudController from '../common/crudController.js';
import OrganizationService from './organizationService.js';
import authHelper from '../common/authHelper.js';

class OrganizationsController extends CrudController {
    constructor(app) {
        super('organizations', app, new OrganizationService(database));
    }

    mapRoutes(app) {
        // Map routes
        super.mapRoutes(app); // map the base CrudController routes

        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        this.app.get(`/api/${this.resourceName}/getbyname/:name`, authHelper.isAuthenticated, this.getByName.bind(this));
        this.app.get(`/api/${this.resourceName}/getbycode/:code`, authHelper.isAuthenticated, this.getByCode.bind(this));
    }

    getAll(req, res, next) {
        res.set("Content-Type", "application/json");

        this.service.getAll()
            .then((docs) => {
                return res.status(200).json(docs);
            })
            .catch(err => {
                err.message = 'ERROR: {0}Controller -> getAll() - {1}'.format(this.resourceName, err.message);
                return next(err);
            });

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
                err.message = 'ERROR: organizationsController -> organizationService.getByName({0}) - {1}'.format(orgName, err.message);
                return next(err);
            });
    }

    getByCode(req, res, next) {
        let orgCode = req.params.code;
        res.set("Content-Type", "application/json");

        this.service.getByCode(orgCode)
            .then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .catch(err => {
                err.message = 'ERROR: organizationsController -> organizationService.getByCode({0}) - {1}'.format(orgCode, err.message);
                return next(err);
            });
    }

    getById (req, res, next) {
        let id = req.params.id;
        res.set("Content-Type", "application/json");

        this.service.getById(id)
            .then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'errors': [err.message]});
                }

                err.message = 'ERROR: {0}Controller -> getById({1}) - {2}'.format(this.resourceName, id, err.message);
                return next(err);
            });
    }

    create(req, res, next) {
        let body = req.body;

        this.service.create(body)
            .then((doc) => {
                return res.status(201).json(doc);
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'errors': [err.message]});
                }

                if (err.code === 11000) {
                    return res.status(409).json({'errors': ['Duplicate Key Error']});
                }

                err.message = 'ERROR: {0}Controller -> create({1}) - {2}'.format(this.resourceName, body, err.message);
                return next(err);
            });
    }

    updateById(req, res, next) {
        let id = req.params.id;
        let body = req.body;

        this.service.updateById(id, body)
            .then((result) => {
                if (result.nModified <= 0) return next();

                return res.status(200).json({});
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'errors': [err.message]});
                }

                err.message = 'ERROR: {0}Controller -> updateById({1}, {2}) - {3}'.format(this.resourceName, id, body, err.message);
                return next(err);
            });
    }

    deleteById (req, res, next) {
        let id = req.params.id;
        this.service.delete(id)
            .then((commandResult) => {
                if (commandResult.result.n <= 0) {
                    return res.status(404).json({'errors': ['id not found']});
                }

                return res.status(204).json({});
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'errors': [err.message]});
                }

                err.message = 'ERROR: {0}Controller -> delete({1}) - {2}'.format(this.resourceName, id, err.message);
                return next(err);
            });
    }

}

export default OrganizationsController;
