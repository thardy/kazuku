var database = require("../database/database").database;
var crudController = require("../common/crudController");
var PageService = require("./pageService");

exports.init = function(app) {
    var pageService = new PageService(database);

    crudController.init('pages', app, pageService);

//    app.get('/api/pages', function (req, res, next) {
//        pageService.getAll()
//            .then(function (pages) {
//                return res.status(200).json(pages);
//            })
//            .then(null, function (err) {
//                err.message = 'pagesController -> pageService.getAll - ' + err.message;
//                next(err);
//            });
//    });
//
//    app.get('/api/pages/:id', function (req, res, next) {
//        var id = req.params.id;
//
//        pageService.getById(id)
//            .then(function (page) {
//                if (page == null) return next();
//
//                res.status(200).json(page);
//            })
//            .then(null, function (err) {
//                err.message = 'pagesController -> pageService.getById - ' + err.message;
//                next(err);
//            });
//    });
//
//    app.post('/api/pages', function (req, res, next) {
//        var body = req.body;
//        pageService.create(body)
//            .then(function (page) {
//                res.status(201).json(page);
//            })
//            .then(null, function (err) {
//                err.message = 'pagesController -> pageService.create - ' + err.message;
//                next(err);
//            });
//    });
//
//    app.put('/api/pages/:id', function (req, res, next) {
//        var id = req.params.id;
//        var body = req.body;
//
//        // todo: change pageService to return a Page
//        pageService.updateById(id, body)
//            .then(function (numAffected) {
//                if (numAffected <= 0) return next();
//
//                res.status(200).json({});
//            })
//            .then(null, function (err) {
//                err.message = 'pagesController -> pageService.updateById - ' + err.message;
//                next(err);
//            });
//    });
//
//    app.delete('/api/pages/:id', function (req, res, next) {
//        var id = req.params.id;
//        pageService.delete(id)
//            .then(function (numAffected) {
//                if (numAffected <= 0) return next();
//
//                res.status(204).json({});
//            })
//            .then(null, function (err) {
//                err.message = 'pagesController -> pageService.delete - ' + err.message;
//                next(err);
//            });
//    });
};