"use strict";
var database = require("../database/database").database;
var CustomDataService = require("./customDataService");

class CustomDataController {

    constructor(app) {
        // todo: change to use auth mechanism
        // todo: test that this gets written on every request (might need to move out of constructor)
        this._app = app;
        this._orgId = 1;
        this._service = new CustomDataService(database);

        this.mapRoutes();
    }

    get app() { return this._app; }
    get orgId() { return this._orgId; }
    get service() { return this._service; }

    mapRoutes() {
        // Map routes
        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        this.app.get('/api/customData/:contentType', this.getAllByContentType.bind(this));
        this.app.get('/api/customData/:contentType/:id', this.getByContentType.bind(this));
        this.app.post('/api/customData/:contentType', this.createByContentType.bind(this));
        this.app.put('/api/customData/:contentType/:id', this.updateByTypeAndId.bind(this));
        this.app.delete('/api/customData/:contentType/:id', this.deleteByTypeAndId.bind(this));
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
                    query = 'contentType={0}&'.format(contentType);
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
            return this.service.find(this.orgId, query)
                .then(function (docs) {
                    return res.status(200).json(docs);
                })
                .catch(err => {
                    err.message = 'ERROR: customDataController -> customDataService.getByContentType({0}, {1}) - {2}'.format(this.orgId, contentType, err.message);
                    return next(err);
                });
        }
        else {
            return this.service.getByContentType(this.orgId, contentType)
                .then(function (docs) {
                    return res.status(200).json(docs);
                })
                .catch(err => {
                    err.message = 'ERROR: customDataController -> customDataService.getByContentType({0}, {1}) - {2}'.format(this.orgId, contentType, err.message);
                    return next(err);
                });
        }
    }

    getByContentType(req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var id = req.params.id;
        res.set("Content-Type", "application/json");

        return this.service.getByTypeAndId(this.orgId, contentType, id)
            .then(function (doc) {
                if (doc === null) {
                    return res.status(404).json({'Errors': ['id not found']});
                }

                return res.status(200).send(doc);
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }

                err.message = 'ERROR: customDataController -> customDataService.getByTypeAndId({0}, {1}, {2}) - {3}'.format(this.orgId, contentType, id, err.message);
                return next(err);
            });
    }

    createByContentType(req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var body = req.body;

        // force body.contentType to equal :contentType
        body.contentType = contentType;

        return this.service.create(this.orgId, body)
            .then(function (customData) {
                return res.status(201).json(customData);
            })
            .catch(err => {
                err.message = 'ERROR: customDataController -> customDataService.create({0}, {1}) - {2}'.format(this.orgId, body, err.message);
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

        return this.service.updateById(this.orgId, id, body)
            .then(function (result) {
                if (result.nModified <= 0) {
                    return res.status(404).json({'Errors': ['Document not found']});
                }

                return res.status(200).json({});
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }
                err.message = 'ERROR: customDataController -> customDataService.updateById({0}, {1}, {2}) - {3}'.format(this.orgId, id, body, err.message);
                return next(err);
            });
    }

    deleteByTypeAndId(req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var id = req.params.id;
        return this.service.deleteByTypeAndId(this.orgId, contentType, id)
            .then((commandResult) => {
                if (commandResult.result.n <= 0) {
                    return res.status(404).json({'Errors': ['id not found']});
                }

                return res.status(204).json({});
            })
            .catch(err => {
                // This is not happening!!!
                if (err.constructor == TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }
                err.message = 'customDataController -> customDataService.deleteByTypeAndId({0}, {1}, {2}) - {3}'.format(this.orgId, contentType, id, err.message);
                return next(err);
            });
    }
}

module.exports = CustomDataController;
