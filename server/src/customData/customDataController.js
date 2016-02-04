var database = require("../database/database");
var CustomDataService = require("./customDataService");

exports.init = function (app) {
    var customDataService = new CustomDataService(database);

    // todo: change to use auth mechanism
    // todo: test that this gets written on every request
    var orgId = 1;

    app.get("/api/customData/:contentType", function (req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        res.set("Content-Type", "application/json");

        if (Object.keys(req.query).length > 0) {
            var query = '';
            var first = true;
            for (var property in req.query) {
                if (first === true) {
                    first = false;
                    // hardocde contentType into the query according to the contentType in the route
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
            customDataService.find(orgId, query)
                .then(function (docs) {
                    return res.status(200).json(docs);
                })
                .then(null, function (err) {
                    err.message = 'ERROR: customDataController -> customDataService.getByContentType({0}, {1}) - {2}'.format(orgId, contentType, err.message);
                    return next(err);
                });
        }
        else {
            customDataService.getByContentType(orgId, contentType)
                .then(function (docs) {
                    return res.status(200).json(docs);
                })
                .then(null, function (err) {
                    err.message = 'ERROR: customDataController -> customDataService.getByContentType({0}, {1}) - {2}'.format(orgId, contentType, err.message);
                    return next(err);
                });
        }
    });

    app.get("/api/customData/:contentType/:id", function (req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var id = req.params.id;
        res.set("Content-Type", "application/json");

        customDataService.getByTypeAndId(orgId, contentType, id)
            .then(function (doc) {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .then(null, function (err) {
                err.message = 'ERROR: customDataController -> customDataService.getByTypeAndId({0}, {1}, {2}) - {3}'.format(orgId, contentType, id, err.message);
                return next(err);
            });
    });

    app.post('/api/customData/:contentType', function (req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var body = req.body;

        // force body.contentType to equal :contentType
        body.contentType = contentType;

        customDataService.create(orgId, body)
            .then(function (customData) {
                return res.status(201).json(customData);
            })
            .then(null, function (err) {
                err.message = 'ERROR: customDataController -> customDataService.create({0}, {1}) - {2}'.format(orgId, body, err.message);
                return next(err);
            });
    });

    app.put('/api/customData/:contentType/:id', function (req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var id = req.params.id;
        var body = req.body;

        // force body.contentType to equal :contentType
        body.contentType = contentType;

        customDataService.updateById(orgId, id, body)
            .then(function (numAffected) {
                if (numAffected <= 0) {
                    return res.status(404).json({'Errors': ['Document not found']});
                }

                return res.status(200).json({});
            })
            .then(null, function (err) {
                err.message = 'ERROR: customDataController -> customDataService.updateById({0}, {1}, {2}) - {3}'.format(orgId, id, body, err.message);
                return next(err);
            });
    });

    app.delete('/api/customData/:contentType/:id', function (req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var id = req.params.id;
        customDataService.deleteByTypeAndId(orgId, contentType, id)
            .then(function (numAffected) {
                if (numAffected <= 0) return next();

                return res.status(204).json({});
            })
            .then(null, function (err) {
                err.message = 'customDataController -> customDataService.deleteByTypeAndId({0}, {1}, {2}) - {3}'.format(orgId, contentType, id, err.message);
                return next(err);
            });
    });
};

