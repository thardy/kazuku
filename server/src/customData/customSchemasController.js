var database = require("../database/database");
var crudController = require("../common/crudController");
var CustomSchemaService = require("./customSchemaService");

exports.init = function (app) {
    var customSchemaService = new CustomSchemaService(database);

    crudController.init('customSchemas', app, customSchemaService);

    // todo: change to use auth mechanism
    // todo: test that this gets written on every request
    var orgId = 1;

    // unlike the util.inherits, here we are just assigning routes to the RESTful verbs

    // Clear out the id routes.  See http://stackoverflow.com/questions/10378690/remove-route-mappings-in-nodejs-express
    // Delete the get, update, and delete routes in crudController that use id
    var routes = app._router.stack;
    routes.forEach(removeIdRoutes);
    // Have to NAME the route functions for this to work - app.get('/blah', function someRoute(req, res, next){});
    function removeIdRoutes(route, i, routes) {
        switch (route.handle.name) {
            case 'getById':
            case 'updateById':
            case 'deleteById':
                routes.splice(i, 1);
        }
        if (route.route)
            route.route.stack.forEach(removeIdRoutes);
    }

    // Add our new get, put, and delete routes that use contentType instead of id
    app.get("/api/customschemas/:contentType", function (req, res, next) {
        var contentType = req.params.contentType;
        res.set("Content-Type", "application/json");

        customSchemaService.getByContentType(orgId, contentType)
            .then(function (doc) {
                if (doc == null) return next();

                return res.status(200).send(doc);
            })
            .then(null, function (err) {
                err.message = 'ERROR: customSchemasController -> customSchemaService.getByContentType({0}, {1}) - {2}'.format(orgId, contentType, err.message);
                return next(err);
            });
    });

    app.put('/api/customschemas/:contentType', function (req, res, next) {
        var contentType = req.params.contentType;
        var body = req.body;

        // force body.contentType to equal :contentType
        body.contentType = contentType;

        customSchemaService.updateByContentType(orgId, contentType, body)
            .then(function (numAffected) {
                if (numAffected <= 0) {
                    return res.status(404).json({'Errors': ['Document not found']});
                }

                return res.status(200).json({});
            })
            .then(null, function (err) {
                err.message = 'ERROR: customSchemasController -> customSchemaService.updateByContentType({0}, {1}, {2}) - {3}'.format(orgId, contentType, body, err.message);
                return next(err);
            });
    });

    app.delete('/api/customschemas/:contentType', function (req, res, next) {
        var contentType = req.params.contentType;
        // todo: Add some serious checking here.  Can't delete a schema unless all data for that schema is deleted first.
        customSchemaService.deleteByContentType(orgId, contentType)
            .then(function (numAffected) {
                if (numAffected <= 0) return next();

                return res.status(204).json({});
            })
            .then(null, function (err) {
                err.message = 'ERROR: customSchemasController -> customSchemaService.deleteByContentType({0}, {1}) - {2}'.format(orgId, contentType, err.message);
                return next(err);
            });
    });

};


