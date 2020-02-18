'use strict';
const database = require('../database/database').database;
const OrganizationService = require('../organizations/organizationService');

const orgService = new OrganizationService(database);

// A middleware that checks to see if the user is authenticated & logged in
const isAuthenticatedWithAdminUser = (req, res, next) => {
    let isAuthenticated = false;
    const isAuthenticatedWithAdminUser = req.isAuthenticated();

    //isAuthenticated = isAuthenticatedWithAdminUser ? true : isAuthenticateWithApiConsumer(req);
    isAuthenticated = isAuthenticatedWithAdminUser;

    if (isAuthenticated) {
        next();
    }
    else {
        res.status(401);
        res.send('Unauthenticated');
    }
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

module.exports = {
    isAuthenticated: isAuthenticatedWithAdminUser,
    isAuthenticatedForApi: isAuthenticatedWithApiConsumer
};