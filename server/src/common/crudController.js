"use strict";
var Promise = require("bluebird");

class CrudController {

    constructor(resourceName, app, service) {
        // todo: change to use auth mechanism
        // todo: test that this gets written on every request and not reused between them
        this._app = app;
        this._orgId = 1;
        this._service = service;
        this._resourceName = resourceName;
    }

    get app() { return this._app; }
    get orgId() { return this._orgId; }
    get service() { return this._service; }
    get resourceName() { return this._resourceName; }

    mapRoutes() {
        // Map routes
        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        this.app.get(`/api/${this.resourceName}`, this.getAll.bind(this));
        this.app.get(`/api/${this.resourceName}/:id`, this.getById.bind(this));
        this.app.post(`/api/${this.resourceName}`, this.create.bind(this));
        this.app.put(`/api/${this.resourceName}/:id`, this.updateById.bind(this));
        this.app.delete(`/api/${this.resourceName}/:id`, this.deleteById.bind(this));
    }

    getAll(req, res, next) {
        res.set("Content-Type", "application/json");

        this.service.getAll(this.orgId)
            .then((docs) => {
                return res.status(200).json(docs);
            })
            .then(null, (err) => {
                err.message = 'ERROR: {0}Controller -> getAll({1}) - {2}'.format(this.resourceName, this.orgId, err.message);
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
            .then(null, (err) => {
                err.message = 'ERROR: {0}Controller -> getById({1}, {2}) - {3}'.format(this.resourceName, this.orgId, id, err.message);
                return next(err);
            });
    }

    create(req, res, next) {
        let body = req.body;

        this.service.create(this.orgId, body)
            .then((doc) => {
                return res.status(201).json(doc);
            })
            .then(null, (err) => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }

                if (err.code === 11000) {
                    return res.status(409).json({'Errors': ['Duplicate Key Error']});
                }

                err.message = 'ERROR: {0}Controller -> create({1}, {2}) - {3}'.format(this.resourceName, this.orgId, body, err.message);
                return next(err);
            });
    }

    updateById(req, res, next) {
        let id = req.params.id;
        let body = req.body;

        this.service.updateById(this.orgId, id, body)
            .then((numAffected) => {
                if (numAffected <= 0) return next();

                return res.status(200).json({});
            })
            .then(null, (err) => {
                if (err.code) {

                }

                err.message = 'ERROR: {0}Controller -> updateById({1}, {2}, {3}) - {4}'.format(this.resourceName, this.orgId, id, body, err.message);
                return next(err);
            });
    }

    deleteById (req, res, next) {
        let id = req.params.id;
        this.service.delete(this.orgId, id)
            .then((numAffected) => {
                if (numAffected <= 0) return next();

                return res.status(204).json({});
            })
            .then(null, (err) => {
                err.message = 'ERROR: {0}Controller -> delete({1}, {2}) - {3}'.format(this.resourceName, this.orgId, id, err.message);
                return next(err);
            });
    }
}

module.exports = CrudController;

