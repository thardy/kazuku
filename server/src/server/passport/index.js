'use strict';
import config from '../config/index.js';
import logger from '../logger/index.js';
import {database} from '../../database/database.js';
import passportFacebook from 'passport-facebook';
const FacebookStrategy = passportFacebook.Strategy;
import passportGoogleOauth from 'passport-google-oauth';
const GoogleStrategy = passportGoogleOauth.Strategy;
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;
import passportJwt from 'passport-jwt';
const JWTstrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;
import UserService from '../../users/userService.js';
// import moment from 'moment';
// import bcrypt from 'bcrypt-nodejs';
// import zone from 'zone.js/dist/zone-node.js';
// const SALT_WORK_FACTOR = 10;

export default (passport) => {
    let userService = new UserService(database);

    // the "context" parm here comes from the done(null, context) call in our LocalStrategy below
    passport.serializeUser((context, done) => {
        //done(null, user.id);
        done(null, context);
    });

    // the "context" parm here comes from the persisted record in mongo session collection (verify)
    // serializeUser/deserializeUser are just used in passport session usage.  I've moved this to authHelper now that I'm using jwt.
    passport.deserializeUser((context, done) => {
        // Find the user using id
        userService.getById(context.user.id)
            .then(user => {
                if (user) {
                    userService.cleanUser(user);
                }
                else {
                    logger.log('error', 'Error when deserializing the user: User not found');
                }

                // Zone current user context is set here
                const fullContext = { user: user, orgId: context.orgId }; // orgId here is the "activeOrgId", and can be changed by metaAdmins when impersonating different orgs
                Zone.current.context = fullContext;
                done(null, fullContext); // fullContext attaches to the request as req.user - we are going to put fullContext into req.user
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

                    // getting rid of session - we should probably remove all of this
                    //req.session.authenticatedUser = newUser;

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
                            Zone.current.context = {user: newUser, orgId: newUser.orgId };
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
    // todo: receiving "OAuthStrategy requires a consumerKey option" out of the blue.  Figure that out if you want to use GoogleStrategy
    // passport.use(new GoogleStrategy(config.google, googleAuthProcessor));

    // this is still used with jwt auth
    passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            let loginUser = null;
            try {
                userService.getByEmail(email)
                    .then((user) => {
                        let promise = Promise.resolve(null);
                        loginUser = user;
                        if (user !== null) {
                            promise = userService.verifyPassword(password, user.password);
                        }

                        return promise;
                    })
                    .then((isMatch) => {
                        if (isMatch === null) {
                            return done(null, false, {message: `Email '${email}' not found`});
                        }
                        else if (isMatch) {
                            const context = {
                                user: {
                                    id: loginUser.id,
                                    email: loginUser.email,
                                    firstName: loginUser.firstName,
                                    lastName: loginUser.lastName,
                                    displayName: loginUser.displayName,
                                    lastLoggedIn: loginUser.lastLoggedIn
                                },
                                orgId: loginUser.orgId  // this will be stored in session and can be changed by metaAdmins
                            };
                            // todo: save new lastLoggedIn date
                            // return done(null, {
                            //     id: loginUser.id,
                            //     email: loginUser.email,
                            //     firstName: loginUser.firstName,
                            //     lastName: loginUser.lastName,
                            //     lastLoggedIn: loginUser.lastLoggedIn
                            // });
                            // the second parm here is the "context" or first parm in the serializeUser call, it should be whatever we want to store in session
                            return done(null, context, { message: 'Login Successful' });
                        }
                        else {
                            return done(null, false, {message: `Invalid email or password`});
                        }
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

    passport.use(
        new JWTstrategy(
            {
                secretOrKey: config.clientSecret,
                jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
            },
            async (token, done) => {
                // token is our full user context ({ user, orgId }, where orgId is the selected orgContext, not necessarily the orgId of the user)
                try {
                    return done(null, token);
                } catch (error) {
                    done(error);
                }
            }
        )
    );
};
