"use strict";
const database = require("../database/database").database;
const CrudController = require("../common/crudController");
const UserService = require("./user.service");
const jwt = require('jsonwebtoken');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../config/config');
const Joi = require('joi');

class AuthController {
    constructor(app) {
        this.app = app;
        // todo: change to use auth mechanism
        // todo: test that this gets written on every request and not reused between them
        this.orgId = 1;
        this.userService = new UserService(database);
        this.resourceName = 'auth';
        this.paramValidation = {
            // POST /api/auth/login
            login: {
                body: {
                    username: Joi.string().required(),
                    password: Joi.string().required()
                }
            }
        };

        this.mapRoutes(app);
    }

    mapRoutes(app) {
        // Map routes
        //super.mapRoutes(app); // map the base CrudController routes

        /** POST /api/auth/login - Returns token if correct username and password is provided */
        app.post(`/api/${this.resourceName}/login`, validate(this.paramValidation.login), this.login.bind(this));

        /** GET /api/auth/random-number - Protected route,
         * needs token returned by the above as header. Authorization: Bearer {token} */
        app.get(`/api/${this.resourceName}/random-number`, expressJwt({ secret: config.jwtSecret }), this.getRandomNumber.bind(this));
    }

    login(req, res, next) {
        let body = req.body;

        this.userService.getByUserName(body.username)
            .then((user) => {
                if (user === null) {
                    let err = new APIError('Username not found', httpStatus.UNAUTHORIZED, true);
                    return next(err);
                }

                if (body.username === user.username && body.password === user.password) {
                    const token = jwt.sign({
                        username: user.username,
                        lastLoggedIn: user.lastLoggedIn
                    }, config.jwtSecret, {
                        expiresInMinutes: 120
                    });
                    return res.json({
                        token,
                        user: req.user
                    });
                }

                const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
                return next(err);
            })
            .catch(err => {
                err.message = 'ERROR: {0}Controller -> login with username = {1} - {3}'.format(this.resourceName, body.username, err.message);
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

module.exports = AuthController;


// const jwt = require('jsonwebtoken');
// const httpStatus = require('http-status');
// const APIError = require('../helpers/APIError');
// const config = require('../../config/config');
//
// // sample user, used for authentication
// const user = {
//     username: 'react',
//     password: 'express'
// };
//
// /**
//  * Returns jwt token if valid username and password is provided
//  * @param req
//  * @param res
//  * @param next
//  * @returns {*}
//  */
// function login(req, res, next) {
//     // Ideally you'll fetch this from the db
//     // Idea here was to show how jwt works with simplicity
//     if (req.body.username === user.username && req.body.password === user.password) {
//         const token = jwt.sign({
//             username: user.username
//         }, config.jwtSecret);
//         return res.json({
//             token,
//             username: user.username
//         });
//     }
//
//     const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
//     return next(err);
// }
//
// /**
//  * This is a protected route. Will return random number only if jwt token is provided in header.
//  * @param req
//  * @param res
//  * @returns {*}
//  */
// function getRandomNumber(req, res) {
//     // req.user is assigned by jwt middleware if valid token is provided
//     return res.json({
//         user: req.user,
//         num: Math.random() * 100
//     });
// }
//
// module.exports = { login, getRandomNumber };
