'use strict';
const config = require('../config');
const logger = require('../logger');
const database = require("../../database/database").database;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const UserService = require('../../users/userService');

module.exports = (passport) => {
    let userService = new UserService(database);

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        // Find the user using id
        userService.getById(id)
            .then(user => done(null, user))
            .catch(error => logger.log('error', 'Error when deserializing the user: ' + error));
    });

    let authProcessor = (accessToken, refreshToken, profile, done) => {
        // Find a user in the local db using profile.id

        // If the user is found, return the user data using the done()
        // If the user is not found, create one in the local db and return
        userService.getById(profile.id)
            .then(result => {
                if (result) {
                    done(null, result);
                } else {
                    // Create a new user and return
                    userService.create(profile)
                        .then(newUser => done(null, newUser))
                        .catch(error => logger.log('error', 'Error when creating new user: ' + error));
                }
            });
    };

    passport.use(new FacebookStrategy(config.fb, authProcessor));
    passport.use(new TwitterStrategy(config.twitter, authProcessor));
    passport.use(new GoogleStrategy(config.google, authProcessor));
    passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            console.log('inside local strategy');
            try {
                userService.getByEmail(email)
                    .then((user) => {
                        if (user === null) {
                            //let err = new APIError(`Email '${email}' not found`, httpStatus.UNAUTHORIZED, true);
                            return done(null, false, {message: `Email '${email}' not found`});
                        }

                        if (email === user.email && password === user.password) {
                            // todo: save new lastLoggedIn date
                            return done(null, {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                lastLoggedIn: user.lastLoggedIn
                            });
                        }
                        else {
                            return done(null, false, {message: `Invalid email or password`});
                        }
                    })
                    .catch(err => {
                        err.message = `ERROR: ${this.resourceName}Controller -> login with email = ${email}.  Message: ${err.message}`;
                        return done(err);
                    });
            }
            catch(ex) {
                console.log(JSON.stringify(ex));
            }
        }
    ));
};
