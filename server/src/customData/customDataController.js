'use strict';
import {database} from '../database/database.js';
import CustomDataService from './customDataService.js';
import authHelper from '../common/authHelper.js';
import current from '../common/current.js';

class CustomDataController {

    constructor(app) {
        this._app = app;
        this._service = new CustomDataService(database);

        this.mapRoutes(app);
    }

    get app() { return this._app; }
    get orgId() { return this._orgId; }
    get service() { return this._service; }

    mapRoutes(app) {
        // Map routes
        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        app.get('/api/custom-data', authHelper.isAuthenticated, this.getAll.bind(this));
        app.get('/api/custom-data/:contentType', authHelper.isAuthenticated, this.getAllByContentType.bind(this));
        app.get('/api/custom-data/:contentType/:id', authHelper.isAuthenticated, this.getByTypeAndId.bind(this));
        app.post('/api/custom-data/:contentType', authHelper.isAuthenticated, this.createByContentType.bind(this));
        app.put('/api/custom-data/:contentType/:id', authHelper.isAuthenticated, this.updateByTypeAndId.bind(this));
        app.delete('/api/custom-data/:contentType/:id', authHelper.isAuthenticated, this.deleteByTypeAndId.bind(this));
    }

    getAll(req, res, next) {
        res.set("Content-Type", "application/json");

        return this.service.getAll(current.context.orgId)
            .then(function (docs) {
                return res.status(200).json(docs);
            })
            .catch(err => {
                err.message = 'ERROR: customDataController -> customDataService.getAllByOrg({0}, {1}) - {2}'.format(current.context.orgId, err.message);
                return next(err);
            });
    }

    getAllByContentType(req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        //  do above validation in validate function
        res.set("Content-Type", "application/json");

        // Build query from querystring parms
        if (Object.keys(req.query).length > 0) {
            // todo: refactor out into function
            var query = '';
            var first = true;
            for (var property in req.query) {
                if (first === true) {
                    first = false;
                    // hardcode contentType into the query according to the contentType in the route
                    // todo: remove any contentType provided in the querystring (don't add it again)
                    query = `contentType=${contentType}&`;
                }
                else {
                    query += '&';
                }

                if (Object.prototype.toString.call(req.query[property]) === '[object Array]') {
                    for (var i = 0; i < req.query[property].length; i++) {
                        if (i > 0) {
                            query += '&';
                        }
                        query += property;
                        query += req.query[property][i] ? '=' + req.query[property][i] : '';
                    }
                }
                else {
                    query += property;
                    query += req.query[property] ? '=' + req.query[property] : '';
                }
            }
            return this.service.find(current.context.orgId, query)
                .then(function (docs) {
                    return res.status(200).json(docs);
                })
                .catch(err => {
                    err.message = 'ERROR: customDataController -> customDataService.getByContentType({0}, {1}) - {2}'.format(current.context.orgId, contentType, err.message);
                    return next(err);
                });
        }
        else {
            return this.service.getByContentType(current.context.orgId, contentType)
                .then(function (docs) {
                    return res.status(200).json(docs);
                })
                .catch(err => {
                    err.message = 'ERROR: customDataController -> customDataService.getByContentType({0}, {1}) - {2}'.format(current.context.orgId, contentType, err.message);
                    return next(err);
                });
        }
    }

    getByTypeAndId(req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var id = req.params.id;
        res.set("Content-Type", "application/json");

        return this.service.getByTypeAndId(current.context.orgId, contentType, id)
            .then(function (doc) {
                if (doc === null) {
                    return res.status(204).json({'errors': ['id not found']});
                }

                return res.status(200).send(doc);
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'errors': [err.message]});
                }

                err.message = 'ERROR: customDataController -> customDataService.getByTypeAndId({0}, {1}, {2}) - {3}'.format(current.context.orgId, contentType, id, err.message);
                return next(err);
            });
    }

    createByContentType(req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var body = req.body;

        // force body.contentType to equal :contentType
        body.contentType = contentType;

        return this.service.create(current.context.orgId, body)
            .then(function (customData) {
                return res.status(201).json(customData);
            })
            .catch(err => {
                err.message = 'ERROR: customDataController -> customDataService.create({0}, {1}) - {2}'.format(current.context.orgId, body, err.message);
                return next(err);
            });
    }

    updateByTypeAndId(req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var id = req.params.id;
        var body = req.body;

        // force body.contentType to equal :contentType
        body.contentType = contentType;

        return this.service.updateById(current.context.orgId, id, body)
            .then(function (result) {
                if (result.nModified <= 0) {
                    return res.status(204).json({'errors': ['Document not found']});
                }

                return res.status(200).json({});
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'errors': [err.message]});
                }
                err.message = 'ERROR: customDataController -> customDataService.updateById({0}, {1}, {2}) - {3}'.format(current.context.orgId, id, body, err.message);
                return next(err);
            });
    }

    deleteByTypeAndId(req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var id = req.params.id;
        return this.service.deleteByTypeAndId(current.context.orgId, contentType, id)
            .then((commandResult) => {
                if (commandResult.result.n <= 0) {
                    return res.status(204).json({'errors': ['id not found']});
                }

                return res.status(204).json({});
            })
            .catch(err => {
                // This is not happening!!!
                if (err.constructor == TypeError) {
                    return res.status(400).json({'errors': [err.message]});
                }
                err.message = 'customDataController -> customDataService.deleteByTypeAndId({0}, {1}, {2}) - {3}'.format(current.context.orgId, contentType, id, err.message);
                return next(err);
            });
    }
}

export default CustomDataController;
