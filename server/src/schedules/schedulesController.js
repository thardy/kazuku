'use strict';
const ScheduleService = require("./scheduleService");
const authHelper = require('../common/authHelper');

class SchedulesController {
    // todo: this whole thing is a wip
    constructor(app) {
        this.app = app;
        this.service = new ScheduleService();
        this.resourceName = 'schedules';

        this.mapRoutes(app);
    }

    mapRoutes(app) {
        // Map routes
        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        app.get(`/api/${this.resourceName}`, authHelper.isAuthenticated,
            this.getByOrgId.bind(this));
        app.put(`/api/${this.resourceName}`, authHelper.isAuthenticated,
            this.updateByOrgId.bind(this));
    }

    getByOrgId(req, res, next) {
        let id = req.params.id;
        res.set('Content-Type', 'application/json');

        this.service.getbyOrgAndSite(id).then((doc) => {
            if (doc === null) return next();

            return res.status(200).send(doc);
        }).catch(err => {
            if (err.constructor == TypeError) {
                return res.status(400).json({'Errors': [err.message]});
            }

            err.message = 'ERROR: {0}Controller -> getById({1}) - {2}'.format(
                this.resourceName, id, err.message);
            return next(err);
        });
    }

    updateByOrgId(req, res, next) {
        let id = req.params.id;
        let body = req.body;

        this.service.updateById(id, body).then((result) => {
            if (result.nModified <= 0) return next();

            return res.status(200).json({});
        }).catch(err => {
            if (err.constructor == TypeError) {
                return res.status(400).json({'Errors': [err.message]});
            }

            err.message = 'ERROR: {0}Controller -> updateById({1}, {2}) - {3}'.format(
                this.resourceName, id, body, err.message);
            return next(err);
        });
    }

    // create(req, res, next) {
    //   let body = req.body;
    //
    //   this.service.create(body)
    //   .then((doc) => {
    //     return res.status(201).json(doc);
    //   })
    //   .catch(err => {
    //     if (err.constructor == TypeError) {
    //       return res.status(400).json({'Errors': [err.message]});
    //     }
    //
    //     if (err.code === 11000) {
    //       return res.status(409).json({'Errors': ['Duplicate Key Error']});
    //     }
    //
    //     err.message = 'ERROR: {0}Controller -> create({1}) - {2}'.format(this.resourceName, body, err.message);
    //     return next(err);
    //   });
    // }

}

module.exports = SchedulesController;
