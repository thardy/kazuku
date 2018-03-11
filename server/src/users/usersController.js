"use strict";
const database = require("../database/database").database;
const passport = require('passport');
const CrudController = require("../common/crudController");
const UserService = require("./userService");
const OrganizationService = require("../organizations/organizationService");
const authHelper = require('../common/authHelper');
const current = require('../common/current');
// const Joi = require('joi');

class UsersController extends CrudController {
    constructor(app) {
        // let paramValidation = {
        //     // POST /api/users
        //     createResource: {
        //         body: {
        //             username: Joi.string().required(),
        //             password: Joi.string().required()
        //         }
        //     },
        //
        //     // UPDATE /api/users/:userId
        //     updateResource: {
        //         body: {
        //             username: Joi.string().required(),
        //             password: Joi.string().required()
        //         },
        //         params: {
        //             id: Joi.string().hex().required()
        //         }
        //     }
        // };
        super('users', app, new UserService(database));
        this.organizationService = new OrganizationService(database);
    }

    mapRoutes(app) {
        // GET /api/users/random-number - Sample Protected route,
        app.get(`/api/${this.resourceName}/random-number`, authHelper.isAuthenticated, this.getRandomNumber.bind(this));
        app.get(`/api/${this.resourceName}/facebook`, passport.authenticate('facebook', { scope : 'email' }));
        app.get(`/api/${this.resourceName}/facebook/callback`, passport.authenticate('facebook'), this.afterAuth.bind(this));
        app.get(`/api/${this.resourceName}/google`, passport.authenticate('google', { scope : ['profile', 'email'] }));
        app.get(`/api/${this.resourceName}/google/callback`, passport.authenticate('google'), this.afterAuth.bind(this));

        app.post(`/api/${this.resourceName}/login`, passport.authenticate('local'), this.afterAuth.bind(this));
        //app.post(`/api/${this.resourceName}/create-social-account`, this.createSocialAccount.bind(this));
        app.post(`/api/${this.resourceName}/register`, this.registerUser.bind(this));
        app.get(`/api/${this.resourceName}/logout`, authHelper.isAuthenticated, this.logout.bind(this));
        app.get(`/api/${this.resourceName}/getusercontext`, authHelper.isAuthenticated, this.getUserContext.bind(this));

        // Map routes
        super.mapRoutes(app); // map the base CrudController routes

        /** Load user when API with userId route parameter is hit */
        //app.param('userId', userCtrl.load);
    }

    logout(req, res) {
        req.logOut();
        res.status(200).json({});
    }

    afterAuth(req, res) {
        const user = req.user;
        // don't return password
        this.service.cleanUser(user);
        res.status(200).json({
            user: req.user
        });
    }

    createSocialAccount(req, res, next) {
        // todo: move the user creation from server/passport/index.js authProcessor function to here, once I change
        //  social auth to collect more info before creating a new account.
        return next()
    }

    // I don't think I need this anymore (consider removing or relegating to an admin-only function)
    registerUser(req, res, next) {
        let body = req.body;

        this.service.create(current.user.orgId, body)
            .then((doc) => {
                return res.status(201).json(doc);
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'errors': [err.message]});
                }

                if (err.code === 11000) {
                    return res.status(409).json({'errors': ['Duplicate Key Error']});
                }

                err.message = 'ERROR: {0}Controller -> create({1}, {2}) - {3}'.format(this.resourceName, current.user.orgId, body, err.message);
                return next(err);
            });
    }

    getUserContext(req, res, next) {
        let loggedInUser = req.user;
        // todo: test this!!!
        // get the org for the loggedInUser
        this.organizationService.getById(loggedInUser.orgId)
            .then((org) => {
                const userContext = {user: loggedInUser, org: org};
                return res.status(200).json(userContext);
            });
    }

    getRandomNumber(req, res, next) {
        // req.user is assigned by jwt middleware if valid token is provided
        //console.log(`Zone id is: ${Zone.current.id}`);
        console.log(`Zone current.user.email = ${current.user.email}`);
        console.log(`Zone current.user.orgId = ${current.user.orgId}`);
        return res.json({
            user: req.user,
            num: Math.random() * 100
        });

    }

}

module.exports = UsersController;
