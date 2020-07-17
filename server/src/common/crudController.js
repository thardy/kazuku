'use strict';
import Promise from 'bluebird';
import authHelper from '../common/authHelper.js';
import current from '../common/current.js';

class CrudController {

    constructor(resourceName, app, service) {
        this.app = app;
        this.service = service;
        this.resourceName = resourceName;

        this.mapRoutes(app);
    }

    mapRoutes(app) {
        // Map routes
        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        app.get(`/api/${this.resourceName}`, authHelper.isAuthenticated, this.getAll.bind(this));
        app.get(`/api/${this.resourceName}/:id`, authHelper.isAuthenticated, this.getById.bind(this));
        app.post(`/api/${this.resourceName}`, authHelper.isAuthenticated, this.create.bind(this));
        app.put(`/api/${this.resourceName}/:id`, authHelper.isAuthenticated, this.updateById.bind(this));
        app.delete(`/api/${this.resourceName}/:id`, authHelper.isAuthenticated, this.deleteById.bind(this));
    }

    getAll(req, res, next) {
        res.set("Content-Type", "application/json");

        this.service.getAll(current.context.orgId)
            .then((docs) => {
                return res.status(200).json(docs);
            })
            .catch(err => {
                err.message = `ERROR: ${this.resourceName}Controller -> getAll(${current.context.orgId}) - ${err.message}`;
                return next(err);
            });

    }

    getById (req, res, next) {
        let id = req.params.id;
        res.set("Content-Type", "application/json");

        this.service.getById(current.context.orgId, id)
            .then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'errors': [err.message]});
                }

                err.message = `ERROR: ${this.resourceName}Controller -> getById(${current.context.orgId}, ${id}) - ${err.message}`;
                return next(err);
            });
    }

    create(req, res, next) {
        let body = req.body;

        this.service.create(current.context.orgId, body)
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

                err.message = `ERROR: ${this.resourceName}Controller -> create(${current.context.orgId}, ${body}) - ${err.message}`;
                return next(err);
            });
    }

    updateById(req, res, next) {
        let id = req.params.id;
        let body = req.body;

        this.service.updateById(current.context.orgId, id, body)
            .then((result) => {
                if (result.nModified <= 0) return next();

                return res.status(200).json({});
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'errors': [err.message]});
                }

                err.message = `ERROR: ${this.resourceName}Controller -> updateById(${current.context.orgId}, ${id}, ${body}}) - ${err.message}`;
                return next(err);
            });
    }

    deleteById (req, res, next) {
        let id = req.params.id;
        this.service.delete(current.context.orgId, id)
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

                err.message = `ERROR: ${this.resourceName}Controller -> delete(${current.context.orgId}, ${id}) - ${err.message}`;
                return next(err);
            });
    }
}

export default CrudController;

