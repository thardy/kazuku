var database = require("../database/database");
var crudController = require("../common/crudController");
var CustomSchemaService = require("./customSchemaService");

exports.init = function (app) {
    var customSchemaService = new CustomSchemaService(database);

    crudController.init('customSchemas', app, customSchemaService);

//    app.get("/api/customSchemas", function (req, res, next) {
//        res.set("Content-Type", "application/json");
//
//        customSchemaService.getAll()
//            .then(function (docs) {
//                return res.status(200).json(docs);
//            })
//            .then(null, function (err) {
//                err.message = 'customSchemasController -> customSchemaService.getAll - ' + err.message;
//                return next(err);
//            });
//    });
//
//    app.get("/api/customSchemas/:id", function (req, res, next) {
//        var id = req.params.id;
//        res.set("Content-Type", "application/json");
//
//        customSchemaService.getById(id)
//            .then(function (doc) {
//                if (doc == null) return next();
//
//                return res.status(200).send(doc);
//            })
//            .then(null, function (err) {
//                err.message = 'customSchemasController -> customSchemaService.getById - ' + err.message;
//                return next(err);
//            });
//    });
//
//    app.post('/api/customSchemas', function (req, res, next) {
//        var body = req.body;
//
//        customSchemaService.create(body)
//            .then(function (page) {
//                return res.status(201).json(page);
//            })
//            .then(null, function (err) {
//                err.message = 'customSchemasController -> customSchemaService.create - ' + err.message;
//                return next(err);
//            });
//    });
//
//    app.put('/api/customSchemas/:id', function (req, res, next) {
//        var id = req.params.id;
//        var body = req.body;
//
//        customSchemaService.updateById(id, body)
//            .then(function (numAffected) {
//                if (numAffected <= 0) return next();
//
//                return res.status(200).json({});
//            })
//            .then(null, function (err) {
//                err.message = 'customSchemasController -> customSchemaService.updateById - ' + err.message;
//                return next(err);
//            });
//    });
//
//    app.delete('/api/customSchemas/:id', function (req, res, next) {
//        var id = req.params.id;
//        customSchemaService.delete(id)
//            .then(function (numAffected) {
//                if (numAffected <= 0) return next();
//
//                return res.status(204).json({});
//            })
//            .then(null, function (err) {
//                err.message = 'customSchemasController -> customSchemaService.deleteByTypeAndId - ' + err.message;
//                return next(err);
//            });
//    });
};


