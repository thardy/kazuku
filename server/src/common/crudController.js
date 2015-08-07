
exports.init = function(resourceName, app, service) {

    app.get('/api/' + resourceName, function (req, res, next) {
        res.set("Content-Type", "application/json");

        service.getAll()
            .then(function (docs) {
                return res.status(200).json(docs);
            })
            .then(null, function (err) {
                err.message = resourceName + 'Controller -> getAll - ' + err.message;
                return next(err);
            });
    });

    app.get('/api/' + resourceName  + '/:id', function (req, res, next) {
        var id = req.params.id;
        res.set("Content-Type", "application/json");

        service.getById(id)
            .then(function (doc) {
                if (doc == null) return next();

                return res.status(200).send(doc);
            })
            .then(null, function (err) {
                err.message = resourceName + 'Controller -> getById - ' + err.message;
                return next(err);
            });
    });

    app.post('/api/' + resourceName, function (req, res, next) {
        var body = req.body;

        service.create(body)
            .then(function (doc) {
                return res.status(201).json(doc);
            })
            .then(null, function (err) {
                err.message = resourceName + 'Controller -> create - ' + err.message;
                return next(err);
            });
    });

    app.put('/api/' + resourceName + '/:id', function (req, res, next) {
        var id = req.params.id;
        var body = req.body;

        service.updateById(id, body)
            .then(function (numAffected) {
                if (numAffected <= 0) return next();

                return res.status(200).json({});
            })
            .then(null, function (err) {
                err.message = resourceName + 'Controller -> updateById - ' + err.message;
                return next(err);
            });
    });

    app.delete('/api/' + resourceName + '/:id', function (req, res, next) {
        var id = req.params.id;
        service.delete(id)
            .then(function (numAffected) {
                if (numAffected <= 0) return next();

                return res.status(204).json({});
            })
            .then(null, function (err) {
                err.message = resourceName + 'Controller -> deleteByTypeAndId - ' + err.message;
                return next(err);
            });
    });
};

//module.exports = CrudController;

