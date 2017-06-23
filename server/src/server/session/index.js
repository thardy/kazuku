'use strict';
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../config');
const db = require('../../database/database').database;

if (process.env.NODE_ENV === 'production') {
    // Initialize session with settings for prod
    module.exports = session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        // todo: figure this out (no Mongoose)
        store  : new MongoStore({db: db})
    });
} else {
    // Initialize session with settings for dev
    module.exports = session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true
    });
}
