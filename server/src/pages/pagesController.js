var database = require("../database/database");
var PageService = require("./pageService");

exports.init = function(app) {
    var pageService = new PageService(database);

    app.get('/api/pages', function (req, res) {
        pageService.getAll(function (err, pages) {
            if (err) res.json(500, err);

            res.json(pages);
        });
    });

    app.get('/api/pages/:id', function (req, res) {
        var id = req.params.id;
        pageService.getById(id, function (err, page) {
            if (err) res.json(500, err);

            if (page) {
                res.json(page);
            }
            else {
                res.json(404);
            }
        });
    });

    app.post('/api/pages', function (req, res) {
        var body = req.body;
        pageService.create(body, function (err, page) {
            if (err) res.json(500, err);

            res.json(201, page);
        });
    });

    app.put('/api/pages/:id', function (req, res) {
        var id = req.params.id;
        var body = req.body;
        // todo: change pageService to return a Page
        pageService.updateById(id, body, function (err, numAffected) {
            // todo: alter to detect not found
            if (err) res.json(500, err);

            res.json(200);
        });
    });

    app.delete('/api/pages/:id', function (req, res) {
        var id = req.params.id;
        pageService.delete(id, function (err) {
            if (err) res.json(500, err);

            res.json(204);
        });
    });
};