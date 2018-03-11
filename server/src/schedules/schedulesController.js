'use strict';
const ScheduleService = require("./scheduleService");
const authHelper = require('../common/authHelper');
const current = require('../common/current');

class SchedulesController {
    constructor(app) {
        this.app = app;
        this.service = new ScheduleService();
        this.resourceName = 'schedules';

        this.mapRoutes(app);
    }

    mapRoutes(app) {
        // Map routes
        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        app.get(`/api/${this.resourceName}/:siteId`, authHelper.isAuthenticated, this.getbyOrgAndSite.bind(this));
        app.put(`/api/${this.resourceName}/:siteId`, authHelper.isAuthenticated, this.scheduleRegenerateJobForOrgSite.bind(this));
    }

    getbyOrgAndSite(req, res, next) {
        let siteId = req.params.siteId;
        res.set('Content-Type', 'application/json');

        this.service.getbyOrgAndSite(current.user.orgId, siteId)
            .then((doc) => {
                if (doc === null) {
                    return res.status(404).json({'errors': ['id not found']});
                }

                return res.status(200).send(doc);
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'errors': [err.message]});
                }

                err.message = 'ERROR: {0}Controller -> getById({1}) - {2}'.format(
                    this.resourceName, id, err.message);
                return next(err);
            });
    }

    scheduleRegenerateJobForOrgSite(req, res, next) {
        let siteId = req.params.siteId;
        let body = req.body;
        const minutes = body.minutes;

        this.service.scheduleRegenerateJobForOrgSite(current.user.orgId, siteId, minutes)
            .then((result) => {
                if (!result) return next();

                return res.status(200).json(result);
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'errors': [err.message]});
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
    //       return res.status(400).json({'errors': [err.message]});
    //     }
    //
    //     if (err.code === 11000) {
    //       return res.status(409).json({'errors': ['Duplicate Key Error']});
    //     }
    //
    //     err.message = 'ERROR: {0}Controller -> create({1}) - {2}'.format(this.resourceName, body, err.message);
    //     return next(err);
    //   });
    // }

}

module.exports = SchedulesController;
