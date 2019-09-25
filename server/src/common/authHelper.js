'use strict';
const { siteService } = require('../sites/siteService');

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

const isAuthenticatedWithApiConsumer = (req, res, next) => {
    let isAuthenticatedWithApiConsumer = false;
    if (req.headers && req.headers['authorization']) {
        let authHeader = req.headers['authorization'];
        const authHeaderArray = authHeader.split('Bearer ');
        if (authHeaderArray && authHeaderArray.length > 0) {
            const siteCode = req.vhost[0];
            const submittedAuthToken = authHeaderArray[1];
            if (siteService.validateSiteAuthToken(siteCode, submittedAuthToken)) {
                isAuthenticatedWithApiConsumer = true;
            }
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