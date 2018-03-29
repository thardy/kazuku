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
        const context = req.user;
        // don't return password
        this.service.cleanUser(context.user);
        res.status(200).json({
            user: context.user
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

        this.service.create(current.context.orgId, body)
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

                err.message = 'ERROR: {0}Controller -> create({1}, {2}) - {3}'.format(this.resourceName, current.context.orgId, body, err.message);
                return next(err);
            });
    }

    getUserContext(req, res, next) {
        let context = req.user;
        // todo: test this!!!
        // get the org for the loggedInUser
        return this.organizationService.getById(context.user.orgId)
            .then((org) => {
                const userContext = {user: context.user, org: org};
                return res.status(200).json(userContext);
            });
    }

    selectOrgContext(req, res, next) {
        // change the orgContext - orgId of logged-in user changes to selection, but only if user is a member of the meta org
        // need to save orgId on session context
        // something like
        //req.session.passport.user.orgId= 'updatedvalue'
        //req.session.save(function(err) {console.log(err);};
    }

    getRandomNumber(req, res, next) {
        // req.user is assigned by jwt middleware if valid token is provided
        //console.log(`Zone id is: ${Zone.current.id}`);
        console.log(`Zone current.context.user.email = ${current.context.user.email}`);
        console.log(`Zone current.context.orgId = ${current.context.orgId}`);
        return res.json({
            user: req.user,
            num: Math.random() * 100
        });

    }

}

module.exports = UsersController;
