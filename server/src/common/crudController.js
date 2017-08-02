'use strict';
const Promise = require("bluebird");
const authHelper = require('../common/authHelper');

class CrudController {

    constructor(resourceName, app, service) {
        // todo: change to use auth mechanism
        // todo: test that this gets written on every request and not reused between them
        this.app = app;
        this.orgId = 1;
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

        this.service.getAll(this.orgId)
            .then((docs) => {
                return res.status(200).json(docs);
            })
            .catch(err => {
                err.message = `ERROR: ${this.resourceName}Controller -> getAll(${this.orgId}) - ${err.message}`;
                return next(err);
            });

    }

    getById (req, res, next) {
        let id = req.params.id;
        res.set("Content-Type", "application/json");

        this.service.getById(this.orgId, id)
            .then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }

                err.message = `ERROR: ${this.resourceName}Controller -> getById(${this.orgId}, ${id}) - ${err.message}`;
                return next(err);
            });
    }

    create(req, res, next) {
        let body = req.body;

        this.service.create(this.orgId, body)
            .then((doc) => {
                return res.status(201).json(doc);
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }

                if (err.code === 11000) {
                    return res.status(409).json({'Errors': ['Duplicate Key Error']});
                }

                err.message = `ERROR: ${this.resourceName}Controller -> create(${this.orgId}, ${body}) - ${err.message}`;
                return next(err);
            });
    }

    updateById(req, res, next) {
        let id = req.params.id;
        let body = req.body;

        this.service.updateById(this.orgId, id, body)
            .then((result) => {
                if (result.nModified <= 0) return next();

                return res.status(200).json({});
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }

                err.message = `ERROR: ${this.resourceName}Controller -> updateById(${this.orgId}, ${id}, ${body}}) - ${err.message}`;
                return next(err);
            });
    }

    deleteById (req, res, next) {
        let id = req.params.id;
        this.service.delete(this.orgId, id)
            .then((commandResult) => {
                if (commandResult.result.n <= 0) {
                    return res.status(404).json({'Errors': ['id not found']});
                }

                return res.status(204).json({});
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }

                err.message = `ERROR: ${this.resourceName}Controller -> delete(${this.orgId}, ${id}) - ${err.message}`;
                return next(err);
            });
    }
}

module.exports = CrudController;

