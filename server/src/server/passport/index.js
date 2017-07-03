'use strict';
const config = require('../config');
const logger = require('../logger');
const database = require("../../database/database").database;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const UserService = require('../../users/userService');
const moment = require('moment');
const bcrypt = require('bcrypt-nodejs');

const SALT_WORK_FACTOR = 10;

module.exports = (passport) => {
    let userService = new UserService(database);

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        // Find the user using id
        userService.getById(id)
            .then(user => {
                if (user) {
                    userService.cleanUser(user);
                }
                else {
                    logger.log('error', 'Error when deserializing the user: User not found');
                }
                done(null, user);
            })
            .catch(error => logger.log('error', 'Error when deserializing the user: ' + error));
    });

    let addSocialProfileProperties = (newUser, socialLogin, accessToken, refreshToken, profile) => {
        switch (socialLogin) {
            case 'facebook':
                newUser.facebook = {};
                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.facebook.name = profile.displayName;
                if (profile.emails && profile.emails[0]) {
                    newUser.facebook.email = profile.emails[0].value;
                }
                break;
            case 'google':
                newUser.google = {};
                newUser.google.id = profile.id;
                newUser.google.token = accessToken;
                newUser.google.name = profile.displayName;
                if (profile.emails && profile.emails[0]) {
                    newUser.google.email = profile.emails[0].value;
                }
                break;
        }

    };

    let authProcessor = (socialLogin, accessToken, refreshToken, profile, done) => {
        // todo: replace orgId assignment with whatever org the user is logging in to
        let orgId = 1;

        // Find a user in db based on their social id
        let query = {};
        switch (socialLogin) {
            case 'facebook':
                query = { 'facebook.id': profile.id };
                break;
            case 'google':
                query = { 'google.id': profile.id };
                break;
        }


        // If the user is found, return the user data using the done()
        // If the user is not found, create one in the local db and return
        return userService.findOne(orgId, query)
            .then((existingUser) => {
                if (existingUser) {
                    done(null, existingUser);
                } else {
                    // Create a new user and return
                    let newUser = {
                        orgId: orgId,
                        email: ''
                    };

                    addSocialProfileProperties(newUser, socialLogin, accessToken, refreshToken, profile);

                    return userService.create(orgId, newUser)
                        .then(createdUser => {
                            return done(null, createdUser);
                        })
                        .catch(error => {
                            logger.log('error', `Error when creating new user with email, ${newUser.email}. Error: ${error}`);
                            return done(error);
                        });
                }
            });
    };

    let facebookAuthProcessor = (accessToken, refreshToken, profile, done) => {
        authProcessor('facebook', accessToken, refreshToken, profile, done);
    };

    let googleAuthProcessor = (accessToken, refreshToken, profile, done) => {
        authProcessor('google', accessToken, refreshToken, profile, done);
    };

    passport.use(new FacebookStrategy(config.fb, facebookAuthProcessor));
    passport.use(new GoogleStrategy(config.google, googleAuthProcessor));
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

                        userService.verifyPassword(password, user.password)
                            .then((isMatch) => {
                                if (isMatch) {
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
                                err.message = `ERROR: passport/index.js -> attempted login with email = ${email}.  Message: ${err.message}`;
                                return done(err);
                            });
                    })
                    .catch(error => {
                        error.message = `ERROR: passport/index.js -> attempted login with email = ${email}.  Message: ${error.message}`;
                        return done(error);
                    });
            }
            catch(ex) {
                console.log(JSON.stringify(ex));
            }
        }
    ));
};
