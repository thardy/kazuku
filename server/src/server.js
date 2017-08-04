'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./server/config');
const session = require('./server/session');
const logger = require('./server/logger');
const routes = require('./server/routes');
require('zone.js/dist/zone-node.js');

// Setup passport auth strategies
const passportAuthStrategies = require('./server/passport')(passport); // pass passport for configuration


function setupAuthZone(req, res, next) {
    return Zone.current.fork({
        name: 'api'
    })
    .run(() => {
        Zone.current.id = Math.random();
        next();
    })
}

app.set('port', config.port || 3001);

// serve static files out of this folder - referenced as /css, /img, /js
console.log('about to load static middleware');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// sessions has to be used before router is mounted
app.use(setupAuthZone);
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

if (!module.parent) {
    // Only use morgan if we aren't running tests.  It clutters up the test output.
    app.use(require('morgan')('combined', {
        stream: {
            write: (message) => {
                // Write to logs
                logger.log('info', message);
            }
        }
    }));
}

// Map the routes - this creates the controllers, and routes are mapped in each controller via the mapRoutes function called in each constructor
routes.map(app);

// custom 404 handler.  This will prevent html being returned for 404s.
app.use((req, res, next) => {
    res.status(404).json({error: "Not Found"});
});

// custom error handler.  This will prevent html being returned for errors.
app.use((err, req, res, next) => {
    if (req.app.get('env') !== 'development') {
        delete err.stack;
    }

    if (typeof err === 'string' || err instanceof String) {
        err = { error: err };
    }
    else {
        let newErr = {};
        newErr.message = err.message || '';
        newErr.stack = err.stack || '';
        err = newErr;
    }

    res.status(err.statusCode || 500).json(err);
});

// the following is now handled in www/bin
// // module.parent check is required to support mocha watch
// // src: https://github.com/mochajs/mocha/issues/1912
// if (!module.parent) {
//     // listen on port config.port
//     app.listen(config.port, () => {
//         console.log(`kazuku server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
//     });
// }
//
module.exports = app;
