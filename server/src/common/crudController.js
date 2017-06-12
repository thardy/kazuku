"use strict";
const validate = require('express-validation');

class CrudController {

    constructor(resourceName, app, service, paramValidation) {
        this.app = app;
        // todo: change to use auth mechanism
        // todo: test that this gets written on every request and not reused between them
        this.orgId = 1;
        this.service = service;
        this.resourceName = resourceName;
        this.paramValidation = paramValidation;

        this.mapRoutes(app);
    }

    mapRoutes(app) {
        // Map routes
        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        app.get(`/api/${this.resourceName}`, this.getAll.bind(this));
        app.get(`/api/${this.resourceName}/:id`, this.getById.bind(this));
        app.post(`/api/${this.resourceName}`, validate(this.paramValidation.createResource), this.create.bind(this));
        app.put(`/api/${this.resourceName}/:id`, validate(this.paramValidation.updateResource), this.updateById.bind(this));
        app.delete(`/api/${this.resourceName}/:id`, this.deleteById.bind(this));
    }

    getAll(req, res, next) {
        res.set("Content-Type", "application/json");

        this.service.getAll(this.orgId)
            .then((docs) => {
                return res.status(200).json(docs);
            })
            .catch(err => {
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
            .catch(err => {
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
            .catch(err => {
                if (err.constructor == TypeError) {
                    console.log('here');
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
            .then((result) => {
                if (result.nModified <= 0) return next();

                return res.status(200).json({});
            })
            .catch(err => {
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
            .catch(err => {
                err.message = 'ERROR: {0}Controller -> delete({1}, {2}) - {3}'.format(this.resourceName, this.orgId, id, err.message);
                return next(err);
            });
    }
}

module.exports = CrudController;

