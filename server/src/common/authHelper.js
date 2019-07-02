'use strict';

// A middleware that checks to see if the user is authenticated & logged in
const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(401);
        res.send('Unauthenticated');
    }
};

const getCurrentOrgId = () => {
    return '5ab7fe90da90fa0fa857a557';
};

module.exports = {
    isAuthenticated
};