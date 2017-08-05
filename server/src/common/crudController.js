'use strict';
const Promise = require("bluebird");
const authHelper = require('../common/authHelper');
const current = require('../common/current');

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

        this.service.getAll(current.user.orgId)
            .then((docs) => {
                return res.status(200).json(docs);
            })
            .catch(err => {
                err.message = `ERROR: ${this.resourceName}Controller -> getAll(${current.user.orgId}) - ${err.message}`;
                return next(err);
            });

    }

    getById (req, res, next) {
        let id = req.params.id;
        res.set("Content-Type", "application/json");

        this.service.getById(current.user.orgId, id)
            .then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }

                err.message = `ERROR: ${this.resourceName}Controller -> getById(${current.user.orgId}, ${id}) - ${err.message}`;
                return next(err);
            });
    }

    create(req, res, next) {
        let body = req.body;

        this.service.create(current.user.orgId, body)
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

                err.message = `ERROR: ${this.resourceName}Controller -> create(${current.user.orgId}, ${body}) - ${err.message}`;
                return next(err);
            });
    }

    updateById(req, res, next) {
        let id = req.params.id;
        let body = req.body;

        this.service.updateById(current.user.orgId, id, body)
            .then((result) => {
                if (result.nModified <= 0) return next();

                return res.status(200).json({});
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }

                err.message = `ERROR: ${this.resourceName}Controller -> updateById(${current.user.orgId}, ${id}, ${body}}) - ${err.message}`;
                return next(err);
            });
    }

    deleteById (req, res, next) {
        let id = req.params.id;
        this.service.delete(current.user.orgId, id)
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

                err.message = `ERROR: ${this.resourceName}Controller -> delete(${current.user.orgId}, ${id}) - ${err.message}`;
                return next(err);
            });
    }
}

module.exports = CrudController;

