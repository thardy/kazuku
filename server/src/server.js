'use strict';
const express = require('express');
const app = express();
const passport = require('passport');
const config = require('./server/config');
const session = require('./server/session');
const logger = require('./server/logger');
const routes = require('../server/routes');

app.set('port', config.port || 3001);

// serve static files out of this folder - referenced as /css, /img, /js
app.use(express.static('public'));

// sessions has to be used before router is mounted
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(require('morgan')('combined', {
    stream: {
        write: (message) => {
            // Write to logs
            logger.log('info', message);
        }
    }
}));

// Map the routes - this creates the controllers, and routes are mapped in each controller via the mapRoutes function called in each constructor
routes.map(app);

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
    // listen on port config.port
    app.listen(config.port, () => {
        console.info(`kazuku server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
    });
}

// // const mongoose = require('mongoose');
// // const util = require('util');
//
// // config should be imported before importing any other file
// const config = require('./server/config/config');
// const app = require('./server/config/express');
//
// const debug = require('debug')('kazuku:server');
//
// // make bluebird default Promise
// Promise = require('bluebird'); // eslint-disable-line no-global-assign
//
// // plugin bluebird promise in mongoose
// //mongoose.Promise = Promise;
//
// // connect to mongo db
// const mongoUri = config.mongo.host;
//
// // module.parent check is required to support mocha watch
// // src: https://github.com/mochajs/mocha/issues/1912
// if (!module.parent) {
//     // listen on port config.port
//     app.listen(config.port, () => {
//         console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
//     });
// }
//
// module.exports = app;
//
