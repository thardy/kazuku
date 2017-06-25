'use strict';

// A middleware that checks to see if the user is authenticated & logged in
let isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(401);
        res.send('Unauthenticated');
    }
};

module.exports = {
    isAuthenticated
};