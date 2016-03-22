"use strict";
var database = require("../database/database");
var CrudController = require("../common/crudController");
var CustomSchemaService = require("./customSchemaService");

class CustomSchemasController extends CrudController {
    constructor(app) {
        super('customSchemas', app, new CustomSchemaService(database));

        this.mapRoutes();
    }

    mapRoutes() {
        // Map routes
        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        this.app.get(`/api/${this.resourceName}`, this.getAll.bind(this));
        this.app.get(`/api/${this.resourceName}/:contentType`, this.getByContentType.bind(this));
        this.app.post(`/api/${this.resourceName}`, this.create.bind(this));
        this.app.put(`/api/${this.resourceName}/:contentType`, this.updateByContentType.bind(this));
        this.app.delete(`/api/${this.resourceName}/:contentType`, this.deleteByContentType.bind(this));
    }

    getByContentType(req, res, next) {
        let contentType = req.params.contentType;
        res.set("Content-Type", "application/json");

        this.service.getByContentType(this.orgId, contentType)
            .then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .then(null, (err) => {
                err.message = 'ERROR: customSchemasController -> customSchemaService.getByContentType({0}, {1}) - {2}'.format(this.orgId, contentType, err.message);
                    return next(err);
            });
    }

    updateByContentType(req, res, next) {
        let contentType = req.params.contentType;
        let body = req.body;

        // force body.contentType to equal :contentType
        body.contentType = contentType;

        this.service.updateByContentType(this.orgId, contentType, body)
            .then((numAffected) => {
                if (numAffected <= 0) {
                    return res.status(404).json({'Errors': ['Document not found']});
                }

                return res.status(200).json({});
            })
            .then(null, (err) => {
                err.message = 'ERROR: customSchemasController -> customSchemaService.updateByContentType({0}, {1}, {2}) - {3}'.format(this.orgId, contentType, body, err.message);
                return next(err);
            });
    }

    deleteByContentType(req, res, next) {
        let contentType = req.params.contentType;

        // todo: Add some serious checking here.  Can't delete a schema unless all data for that schema is deleted first.
        this.service.deleteByContentType(this.orgId, contentType)
            .then((numAffected) => {
                if (numAffected <= 0) return next();

                    return res.status(204).json({});
            })
            .then(null, (err) => {
                err.message = 'ERROR: customSchemasController -> customSchemaService.deleteByContentType({0}, {1}) - {2}'.format(this.orgId, contentType, err.message);
                return next(err);
            });
    }
}

module.exports = CustomSchemasController;



