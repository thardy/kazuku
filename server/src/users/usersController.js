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
        // GET /api/auth/random-number - Sample Protected route,
        app.get(`/api/${this.resourceName}/random-number`, authHelper.isAuthenticated, this.getRandomNumber.bind(this));

        app.post(`/api/${this.resourceName}/login`, passport.authenticate('local'), this.respond);
        //app.post(`/api/${this.resourceName}/login`, passport.authenticate('local', { session: false }), this.serialize, this.generateToken, this.respond);

        // Map routes
        super.mapRoutes(app); // map the base CrudController routes

        /** Load user when API with userId route parameter is hit */
        //app.param('userId', userCtrl.load);
    }

   respond(req, res) {
        res.status(200).json({
            user: req.user
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
