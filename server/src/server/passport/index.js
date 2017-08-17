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
require('zone.js/dist/zone-node.js');
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

                Zone.current.currentUser = user;
                done(null, user); // user attaches to the request as req.user
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
                    newUser.email = newUser.facebook.email;
                }
                break;
            case 'google':
                newUser.google = {};
                newUser.google.id = profile.id;
                newUser.google.token = accessToken;
                newUser.google.name = profile.displayName;
                if (profile.emails && profile.emails[0]) {
                    newUser.google.email = profile.emails[0].value;
                    newUser.email = newUser.google.email;
                }
                break;
        }

    };

    let authProcessor = (socialLogin, req, accessToken, refreshToken, profile, done) => {
        // todo: replace orgId assignment with whatever org the user is logging in to (get orgId from site or host or sumpin)
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

                    req.session.authenticatedUser = newUser;

                    // do we really need to get an email for a socially authenticated user?
                    // if so, we'll want to verify the email they provide

                    // todo: When I want to collect more info after authenticating with google or facebook, just return
                    //  done() and return some sort of success to client (in next middleware), have client display the
                    //  "you're almost done" form, collect the extra data, complete the account
                    //  (call create-social-account), and log them in with req.login().
                    // After calling done(), test that the next middleware gets executed, but that req.isAuthenticated
                    //  is still false
                    // return done();

                    return userService.create(orgId, newUser)
                        .then(createdUser => {
                            Zone.current.currentUser = newUser;
                            return done(null, createdUser);
                        })
                        .catch(error => {
                            logger.log('error', `Error when creating new user with email, ${newUser.email}. Error: ${error}`);
                            return done(error);
                        });
                }
            });
    };

    // move the following to usercontroller
    // completeRegistration() {
    //     // verify that we are not yet authenticated
    //     const isAuthenticated = req.isAuthenticated();
    //
    //     // create the user now and call req.login(newUser) to log the user in, and of course test it all
    // }


    let facebookAuthProcessor = (req, accessToken, refreshToken, profile, done) => {
        authProcessor('facebook', req, accessToken, refreshToken, profile, done);
    };

    let googleAuthProcessor = (req, accessToken, refreshToken, profile, done) => {
        authProcessor('google', req, accessToken, refreshToken, profile, done);
    };

    passport.use(new FacebookStrategy(config.fb, facebookAuthProcessor));
    passport.use(new GoogleStrategy(config.google, googleAuthProcessor));
    passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
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
