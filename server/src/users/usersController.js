"use strict";
const database = require("../database/database").database;
const passport = require('passport');
const CrudController = require("../common/crudController");
const UserService = require("./userService");
const authHelper = require('../common/authHelper');
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

        this.mapRoutes(app);
    }

    mapRoutes(app) {
        // GET /api/users/random-number - Sample Protected route,
        app.get(`/api/${this.resourceName}/random-number`, authHelper.isAuthenticated, this.getRandomNumber.bind(this));
        app.get(`/api/${this.resourceName}/facebook`, passport.authenticate('facebook'));
        app.get(`/api/${this.resourceName}/facebook/callback`, passport.authenticate('facebook'));
        app.get(`/api/${this.resourceName}/twitter`, passport.authenticate('twitter'));
        app.get(`/api/${this.resourceName}/twitter/callback`, passport.authenticate('twitter'));
        app.get(`/api/${this.resourceName}/google`, passport.authenticate('google', { scope : ['profile', 'email'] }));
        app.get(`/api/${this.resourceName}/google/callback`, passport.authenticate('google'));

        app.post(`/api/${this.resourceName}/login`, passport.authenticate('local'), this.respond.bind(this));
        app.post(`/api/${this.resourceName}/register`, this.registerUser.bind(this));
        app.get(`/api/${this.resourceName}/logout`, this.logout.bind(this));

        // Map routes
        super.mapRoutes(app); // map the base CrudController routes

        /** Load user when API with userId route parameter is hit */
        //app.param('userId', userCtrl.load);
    }

    logout(req, res) {
        req.logOut();
        res.send(200);
    }

    respond(req, res) {
        const user = req.user;
        // don't return password
        delete user.password;
        res.status(200).json({
            user: req.user
        });
    }

    registerUser(req, res, next) {
        let body = req.body;

        this.service.create(this.orgId, body)
            .then((doc) => {
                return res.status(201).json(doc);
            })
            .catch(err => {
                if (err.constructor == TypeError) {
                    return res.status(400).json({'Errors': [err.message]});
                }

                if (err.code === 11000) {
                    return res.status(409).json({'Errors': ['Duplicate Key Error']});
                }

                err.message = 'ERROR: {0}Controller -> create({1}, {2}) - {3}'.format(this.resourceName, this.orgId, body, err.message);
                return next(err);
            });
    }

    getRandomNumber (req, res, next) {
        // req.user is assigned by jwt middleware if valid token is provided
        return res.json({
            user: req.user,
            num: Math.random() * 100
        });

    }

}

module.exports = UsersController;
