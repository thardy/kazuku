'use strict';
import Promise from 'bluebird';
import {database} from '../database/database.js';
import SetupService from './setupService.js';
import OrganizationService from '../organizations/organizationService.js';
import apiHelper from '../common/apiHelper.js';
import AuthService from '../auth/authService.js';

class SetupController {

    constructor(app) {
        this.app = app;
        this.setupService = new SetupService(database);
        this.organizationService = new OrganizationService(database);
        this.authService = new AuthService(database);

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

        const deviceId = this.authService.getAndSetDeviceIdCookie(req, res);

        this.setupService.initialSetup(body, deviceId)
            .then((doc) => {
                return res.status(201).json(doc);
            })
            .catch(err => {
                if (err.constructor === TypeError) {
                    return res.status(400).json({'errors': [err.message]});
                }

                if (err.code === 11000) {
                    return res.status(409).json({'errors': ['Duplicate Key Error']});
                }

                err.message = `ERROR: SetupController -> create(${body}) - ${err.message}`;
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

export default SetupController;

