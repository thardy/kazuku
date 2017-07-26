'use strict';
const Promise = require('bluebird');
const database = require('../database/database').database;
const SetupService = require('./setupService');
const OrganizationService = require('../organizations/organizationService');
const apiHelper = require('../common/apiHelper');

class SetupController {

    constructor(app) {
        // todo: change to use auth mechanism
        // todo: test that this gets written on every request and not reused between them
        this.app = app;
        this.setupService = new SetupService(database);
        this.organizationService = new OrganizationService(database);

        this.mapRoutes(app);
    }

    mapRoutes(app) {
        // Map routes
        // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
        app.post(`/api/setup/initialsetup`, this.initialSetup.bind(this));
        app.get(`/api/setup/setupstate`, this.getSetupState.bind(this));
    }

    initialSetup(req, res, next) {
        let body = req.body;

        this.setupService.initialSetup(body)
            .then((doc) => {
                return res.status(201).json(doc);
            })
            .catch(err => {
                if (err.constructor === TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }

                if (err.code === 11000) {
                    return res.status(409).json({'Errors': ['Duplicate Key Error']});
                }

                err.message = 'ERROR: SetupController -> create({0}) - {1}'.format(body, err.message);
                return next(err);
            });
    }

    getSetupState(req, res, next) {
        this.organizationService.findOne({code: 'admin'})
            .then((org) => {
                // if we found an org with an id for code = 'admin", then setup has been completed
                let setupCompleted = !!(org && org.id);
                return res.status(200).json(apiHelper.apiResult({setupCompleted: setupCompleted}));
            });
    }

}

module.exports = SetupController;

