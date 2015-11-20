var database = require("../database/database");
var CustomDataService = require("./customDataService");

exports.init = function (app) {
    var customDataService = new CustomDataService(database);

    app.get("/api/customData/:contentType", function (req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        res.set("Content-Type", "application/json");

        customDataService.getByContentType(contentType)
            .then(function (docs) {
                return res.status(200).json(docs);
            })
            .then(null, function (err) {
                err.message = 'customDataController -> customDataService.getByContentType - ' + err.message;
                return next(err);
            });
    });

    app.get("/api/customData/:contentType/:id", function (req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var id = req.params.id;
        res.set("Content-Type", "application/json");

        customDataService.getByTypeAndId(contentType, id)
            .then(function (doc) {
                if (doc == null) return next();

                return res.status(200).send(doc);
            })
            .then(null, function (err) {
                err.message = 'customDataController -> customDataService.getByTypeAndId - ' + err.message;
                return next(err);
            });
    });

    app.post('/api/customData/:contentType', function (req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var body = req.body;

        // force body.contentType to equal :contentType
        body.contentType = contentType;

        customDataService.create(body)
            .then(function (customData) {
                return res.status(201).json(customData);
            })
            .then(null, function (err) {
                err.message = 'customDataController -> customDataService.create - ' + err.message;
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

        customDataService.updateById(id, body)
            .then(function (numAffected) {
                if (numAffected <= 0) return next();

                return res.status(200).json({});
            })
            .then(null, function (err) {
                err.message = 'customDataController -> customDataService.updateById - ' + err.message;
                return next(err);
            });
    });

    app.delete('/api/customData/:contentType/:id', function (req, res, next) {
        var contentType = req.params.contentType;
        // todo: cache all the schemas for each org and validate contentType against available schemas.  Error if not found.
        var id = req.params.id;
        customDataService.deleteByTypeAndId(contentType, id)
            .then(function (numAffected) {
                if (numAffected <= 0) return next();

                return res.status(204).json({});
            })
            .then(null, function (err) {
                err.message = 'customDataController -> customDataService.deleteByTypeAndId - ' + err.message;
                return next(err);
            });
    });
};

