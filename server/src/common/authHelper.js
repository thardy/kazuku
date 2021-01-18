'use strict';
import {database} from '../database/database.js';
import OrganizationService from '../organizations/organizationService.js';
import passport from 'passport';
import UserService from '../users/userService.js';
import logger from '../server/logger';
import jwt from 'jsonwebtoken';
import config from '../server/config';

const orgService = new OrganizationService(database);
const userService = new UserService(database);

// A middleware that checks to see if the user is authenticated & logged in
const isAuthenticatedWithAdminUser = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, context, info) => {
        if (err) { return next(err); }
        if (!context) {
            res.status(401);
            return res.send('Unauthenticated');
        }

        // Zone current user context is set here
        Zone.current.context = context;
        req.user = context;
        return next();
    })(req, res, next);

    // let isAuthenticated = false;
    // const isAuthenticatedWithAdminUser = req.isAuthenticated();

    // isAuthenticated = isAuthenticatedWithAdminUser;
    //
    // if (isAuthenticated) {
    //     next();
    // }
    // else {
    //     res.status(401);
    //     res.send('Unauthenticated');
    // }
};

const isAuthenticatedWithApiConsumer = async (req, res, next) => {
    let isAuthenticatedWithApiConsumer = false;
    if (req.headers && req.headers['authorization']) {
        let authHeader = req.headers['authorization'];
        const authHeaderArray = authHeader.split('Bearer ');
        if (authHeaderArray && authHeaderArray.length > 0) {
            const orgCode = req.vhost[0];
            const submittedAuthToken = authHeaderArray[1];
            // returns orgId if valid
            const orgId = await orgService.validateRepoAuthToken(orgCode, submittedAuthToken);
            isAuthenticatedWithApiConsumer = !!orgId;
            const fullContext = { user: {firstName: 'Api', lastName: 'Consumer', email:'api_consumer'}, orgId: orgId };
            // Zone current user context is set here
            Zone.current.context = fullContext;
        }
    }

    if (isAuthenticatedWithApiConsumer) {
        next();
    }
    else {
        res.status(401);
        res.json({
            errors: ['Unauthenticated']
        });
    }
    return isAuthenticatedWithApiConsumer;
};

// generate jwt and send back loginResponse { tokens: {accessToken, refreshToken}, userContext: {user, org}}
const login = async (req, res, context) => {
    req.login(
        context,
        { session: false },
        async (error) => {
            if (error) return next(error);

            // todo: test this
            //  get client working with the token
            //  get server working purely as an api
            const body = { user: context.user, orgId: context.orgId };
            const expiresIn = 3600; // (seconds) 1 hour expiration on this jwt
            // generate the jwt (uses jsonwebtoken library)
            const token = jwt.sign(
                body,
                config.clientSecret,
                {
                    expiresIn: expiresIn
                }
            );

            const org = await orgService.getById(context.orgId);

            const expiresOn = Date.now() + (expiresIn * 1000); // exactly when the token expires (in milliseconds since Jan 1, 1970 UTC)
            const loginResponse = {
                tokens: {
                    accessToken: token,
                    refreshToken: 'refreshToken is not implemented yet!',
                    expiresOn: expiresOn
                },
                userContext: {
                    user: context.user,
                    org: org
                }
            };

            return res.json(loginResponse);
            //return res.json({ token });
        }
    );
};

export default {
    isAuthenticated: isAuthenticatedWithAdminUser,
    isAuthenticatedForApi: isAuthenticatedWithApiConsumer,
    login: login
};