'use strict';

// A middleware that checks to see if the user is authenticated & logged in
const isAuthenticated = (req, res, next) => {
    let isAuthenticated = false;
    const isAuthenticatedWithPassport = req.isAuthenticated();

    isAuthenticated = isAuthenticatedWithPassport ? true : authenticateWithApiConsumer(req);

    if (isAuthenticated) {
        next();
    } else {
        res.status(401);
        res.send('Unauthenticated');
    }
};

const authenticateWithApiConsumer = (req) => {
    let isAuthenticatedWithApiConsumer = false;
    if (req.headers && req.headers['authorization']) {
        let authHeader = req.headers['authorization'];
        const authHeaderArray = authHeader.split('Bearer ');
        if (authHeaderArray && authHeaderArray.length > 0) {
            const siteCode = req.vhost[0];
            const submittedAuthToken = authHeaderArray[1];
            // todo: define and implement this somewhere
            if (siteService.validateSiteAuthToken(siteCode, submittedAuthToken)) {
                isAuthenticatedWithApiConsumer = true;
            }
        }
    }

    return isAuthenticatedWithApiConsumer;
};

module.exports = {
    isAuthenticated
};