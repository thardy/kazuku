'use strict';
const database = require('../database/database').database;
const CrudController = require('../common/crudController');
const CustomSchemaService = require('./customSchemaService');
const authHelper = require('../common/authHelper');
const current = require('../common/current');

class CustomSchemasController extends CrudController {
    constructor(app) {
        super('customSchemas', app, new CustomSchemaService(database));
    }

    mapRoutes(app) {
        // Map routes
        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        app.get(`/api/${this.resourceName}`, authHelper.isAuthenticated,
            this.getAll.bind(this));
        app.get(`/api/${this.resourceName}/:contentType`,
            authHelper.isAuthenticated, this.getByContentType.bind(this));
        app.post(`/api/${this.resourceName}`, authHelper.isAuthenticated,
            this.create.bind(this));
        app.put(`/api/${this.resourceName}/:contentType`,
            authHelper.isAuthenticated, this.updateByContentType.bind(this));
        app.delete(`/api/${this.resourceName}/:contentType`,
            authHelper.isAuthenticated, this.deleteByContentType.bind(this));
    }

    getByContentType(req, res, next) {
        let contentType = req.params.contentType;
        res.set('Content-Type', 'application/json');

        this.service.getByContentType(current.user.orgId, contentType).
            then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            }).
            catch(err => {
                err.message = 'ERROR: customSchemasController -> customSchemaService.getByContentType({0}, {1}) - {2}'.format(
                    current.user.orgId, contentType, err.message);
                return next(err);
            });
    }

    updateByContentType(req, res, next) {
        let contentType = req.params.contentType;
        let body = req.body;

        // force body.contentType to equal :contentType
        body.contentType = contentType;

        this.service.updateByContentType(current.user.orgId, contentType, body).
            then((result) => {
                if (result.nModified <= 0) {
                    return res.status(404).
                        json({'errors': ['Document not found']});
                }

                return res.status(200).json({});
            }).
            catch(err => {
                err.message = 'ERROR: customSchemasController -> customSchemaService.updateByContentType({0}, {1}, {2}) - {3}'.format(
                    current.user.orgId, contentType, body, err.message);
                return next(err);
            });
    }

    deleteByContentType(req, res, next) {
        let contentType = req.params.contentType;

        // todo: Add some serious checking here.  Can't delete a schema unless all data for that schema is deleted first.
        this.service.deleteByContentType(current.user.orgId, contentType).
            then((numAffected) => {
                if (numAffected <= 0) return next();

                return res.status(204).json({});
            }).
            catch(err => {
                err.message = 'ERROR: customSchemasController -> customSchemaService.deleteByContentType({0}, {1}) - {2}'.format(
                    current.user.orgId, contentType, err.message);
                return next(err);
            });
    }
}

module.exports = CustomSchemasController;



