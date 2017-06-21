"use strict";
const database = require("../database/database").database;
const CrudController = require("../common/crudController");
const UserService = require("./user.service");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../server/config');
const authHelper = require('../helpers/authHelper');
const Joi = require('joi');
const ObjectID = require('mongodb').ObjectID;

class AuthController {
    constructor(app) {
        this.app = app;
        // todo: change to use auth mechanism
        // todo: test that this gets written on every request and not reused between them
        this.orgId = '5949fdeff8e794bdbbfd3d85';
        //this.userService = new UserService(database);
        this.resourceName = 'auth';
        // this.paramValidation = {
        //     // POST /api/auth/login
        //     login: {
        //         body: {
        //             email: Joi.string().required(),
        //             password: Joi.string().required()
        //         }
        //     }
        // };

        this.mapRoutes(app);
    }

    mapRoutes(app) {
        // Map routes
        //super.mapRoutes(app); // map the base CrudController routes

        /** POST /api/auth/login - Returns token if correct email and password is provided */
        //app.post(`/api/${this.resourceName}/login`, validate(this.paramValidation.login), this.login.bind(this));

        /** POST /api/auth/login - Returns token if correct email and password is provided */
        // app.post(`/api/${this.resourceName}/login`, (req, res) => {
        //     res.send('I am the login route');
        // });
        app.post(`/api/${this.resourceName}/login`, passport.authenticate('local'), this.respond);
        //app.post(`/api/${this.resourceName}/login`, passport.authenticate('local', { session: false }), this.serialize, this.generateToken, this.respond);

        /** GET /api/auth/random-number - Protected route,
         * needs token returned by the above as header. Authorization: Bearer {token} */
        app.get(`/api/${this.resourceName}/random-number`, authHelper.isAuthenticated, this.getRandomNumber.bind(this));

    }

    // todo: use this to update lastLoggedIn datetime
    // serialize(req, res, next) {
    //     db.update(req.user, function(err, user){
    //         if(err) {return next(err);}
    //         // we store the updated information in req.user again
    //         req.user = {
    //             id: user.id
    //         };
    //         next();
    //     });
    // }

    generateToken(req, res, next) {
        req.token = jwt.sign({
                email: req.user.email,
                lastLoggedIn: req.user.lastLoggedIn
            },
            config.jwtSecret,
            { expiresIn: '2h' });

        next();
    }

    respond(req, res) {
        res.status(200).json({
            user: req.user
        });
    }

    // Returns jwt token if valid username and password is provided
    // login(req, res, next) {
    //     let body = req.body;
    //
    //     this.userService.getByUserName(body.username)
    //         .then((user) => {
    //             if (user === null) {
    //                 let err = new APIError('Username not found', httpStatus.UNAUTHORIZED, true);
    //                 return next(err);
    //             }
    //
    //             if (body.username === user.username && body.password === user.password) {
    //                 const token = jwt.sign({
    //                     username: user.username,
    //                     lastLoggedIn: user.lastLoggedIn
    //                 }, config.jwtSecret, {
    //                     expiresInMinutes: 120
    //                 });
    //                 return res.json({
    //                     token,
    //                     user: req.user
    //                 });
    //             }
    //
    //             const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    //             return next(err);
    //         })
    //         .catch(err => {
    //             err.message = 'ERROR: {0}Controller -> login with username = {1} - {3}'.format(this.resourceName, body.username, err.message);
    //             return next(err);
    //         });
    // }

    getRandomNumber (req, res, next) {
        // req.user is assigned by jwt middleware if valid token is provided
        return res.json({
            user: req.user,
            num: Math.random() * 100
        });

    }

}

module.exports = AuthController;
