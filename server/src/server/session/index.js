'use strict';
// DEPRECATED - we are no longer using session
import session from 'express-session';
import connectMongo from 'connect-mongo';
const MongoStore = connectMongo(session);
//const SkinStore = require('connect-mongoskin');
import config from '../config/index.js';
import {database} from '../../database/database.js';

let theExport = {};

if (process.env.NODE_ENV === 'production') {
    // Initialize session with settings for prod
    theExport = session({
        secret: config.sessionSecret,
        rolling: true,
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({ url: config.mongoDbUrl }),
        cookie: { maxAge: 3600000 }
    });
} else {
    // Initialize session with settings for dev
    theExport = session({
        secret: config.sessionSecret,
        rolling: true,
        resave: true,
        saveUninitialized: true,
        // todo: figure this out (use existing connection)
        //store: new SkinStore(db.db)
        store: new MongoStore({ url: config.mongoDbUrl }),
        cookie: { maxAge: 3600000 }
    });
}

export default theExport;