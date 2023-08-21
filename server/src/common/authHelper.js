'use strict';
import {database} from '../database/database.js';
import OrganizationService from '../organizations/organizationService.js';
import passport from 'passport';
import AuthService from '../auth/authService.js';
import logger from '../server/logger/index.js';
import jwt from 'jsonwebtoken';
import config from '../server/config/index.js';
import crypto from "crypto";

const orgService = new OrganizationService(database);
const authService = new AuthService(database);

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

export default {
    isAuthenticated: isAuthenticatedWithAdminUser,
    isAuthenticatedForApi: isAuthenticatedWithApiConsumer,
};