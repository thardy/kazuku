var Promise = require("bluebird");

exports.init = function(resourceName, app, service) {
    // todo: change to use auth mechanism
    // todo: test that this gets written on every request
    var orgId = 1;

    app.get('/api/' + resourceName, function getAll(req, res, next) {
        res.set("Content-Type", "application/json");

        service.getAll(orgId)
            .then(function (docs) {
                return res.status(200).json(docs);
            })
            .then(null, function (err) {
                err.message = 'ERROR: {0}Controller -> getAll({1}) - {2}'.format(resourceName, orgId, err.message);
                return next(err);
            });
    });

    app.get('/api/' + resourceName  + '/:id', function getById(req, res, next) {
        var id = req.params.id;
        res.set("Content-Type", "application/json");

        service.getById(orgId, id)
            .then(function (doc) {
                if (doc == null) return next();

                return res.status(200).send(doc);
            })
            .then(null, function (err) {
                err.message = 'ERROR: {0}Controller -> getById({1}, {2}) - {3}'.format(resourceName, orgId, id, err.message);
                return next(err);
            });
    });

    app.post('/api/' + resourceName, function create(req, res, next) {
        var body = req.body;

        service.create(orgId, body)
            .then(function (doc) {
                return res.status(201).json(doc);
            })
            .then(null, function(err) {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }

                if (err.code === 11000) {
                    return res.status(409).json({'Errors': ['Duplicate Key Error']});
                }

                err.message = 'ERROR: {0}Controller -> create({1}, {2}) - {3}'.format(resourceName, orgId, body, err.message);
                return next(err);
            });
    });

    app.put('/api/' + resourceName + '/:id', function updateById(req, res, next) {
        var id = req.params.id;
        var body = req.body;

        service.updateById(orgId, id, body)
            .then(function (numAffected) {
                if (numAffected <= 0) return next();

                return res.status(200).json({});
            })
            .then(null, function (err) {
                if (err.code) {

                }

                err.message = 'ERROR: {0}Controller -> updateById({1}, {2}, {3}) - {4}'.format(resourceName, orgId, id, body, err.message);
                return next(err);
            });
    });

    app.delete('/api/' + resourceName + '/:id', function deleteById(req, res, next) {
        var id = req.params.id;
        service.delete(orgId, id)
            .then(function (numAffected) {
                if (numAffected <= 0) return next();

                return res.status(204).json({});
            })
            .then(null, function (err) {
                err.message = 'ERROR: {0}Controller -> delete({1}, {2}) - {3}'.format(resourceName, orgId, id, err.message);
                return next(err);
            });
    });
};

//module.exports = CrudController;

