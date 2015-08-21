var database = require("../database/database");
var crudController = require("../common/crudController");
var CustomDataSchemaService = require("./customDataSchemaService");

exports.init = function (app) {
    var customDataSchemaService = new CustomDataSchemaService(database);

    crudController.init('customDataSchema', app, customDataSchemaService);

//    app.get("/api/customDataSchema", function (req, res, next) {
//        res.set("Content-Type", "application/json");
//
//        customDataSchemaService.getAll()
//            .then(function (docs) {
//                return res.status(200).json(docs);
//            })
//            .then(null, function (err) {
//                err.message = 'customDataSchemaController -> customDataSchemaService.getAll - ' + err.message;
//                return next(err);
//            });
//    });
//
//    app.get("/api/customDataSchema/:id", function (req, res, next) {
//        var id = req.params.id;
//        res.set("Content-Type", "application/json");
//
//        customDataSchemaService.getById(id)
//            .then(function (doc) {
//                if (doc == null) return next();
//
//                return res.status(200).send(doc);
//            })
//            .then(null, function (err) {
//                err.message = 'customDataSchemaController -> customDataSchemaService.getById - ' + err.message;
//                return next(err);
//            });
//    });
//
//    app.post('/api/customDataSchema', function (req, res, next) {
//        var body = req.body;
//
//        customDataSchemaService.create(body)
//            .then(function (page) {
//                return res.status(201).json(page);
//            })
//            .then(null, function (err) {
//                err.message = 'customDataSchemaController -> customDataSchemaService.create - ' + err.message;
//                return next(err);
//            });
//    });
//
//    app.put('/api/customDataSchema/:id', function (req, res, next) {
//        var id = req.params.id;
//        var body = req.body;
//
//        customDataSchemaService.updateById(id, body)
//            .then(function (numAffected) {
//                if (numAffected <= 0) return next();
//
//                return res.status(200).json({});
//            })
//            .then(null, function (err) {
//                err.message = 'customDataSchemaController -> customDataSchemaService.updateById - ' + err.message;
//                return next(err);
//            });
//    });
//
//    app.delete('/api/customDataSchema/:id', function (req, res, next) {
//        var id = req.params.id;
//        customDataSchemaService.delete(id)
//            .then(function (numAffected) {
//                if (numAffected <= 0) return next();
//
//                return res.status(204).json({});
//            })
//            .then(null, function (err) {
//                err.message = 'customDataSchemaController -> customDataSchemaService.deleteByTypeAndId - ' + err.message;
//                return next(err);
//            });
//    });
};


