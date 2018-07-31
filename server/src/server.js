'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./server/config');
const session = require('./server/session');
const logger = require('./server/logger');
const routes = require('./server/routes');
const vhost = require('vhost');
require('zone.js/dist/zone-node.js');
const path = require('path');

global.appRoot = path.resolve(__dirname);

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

// Main server app
const main = express();
main.set('port', config.port || 3001);

// serve static files out of this folder - referenced as /css, /img, /js
console.log('about to load static middleware');
main.use(express.static(global.appRoot + '/public', {extensions:['html']}));
main.use(bodyParser.json());

// sessions has to be used before router is mounted
main.use(setupAuthZone);
main.use(session);
main.use(passport.initialize());
main.use(passport.session());

if (!module.parent) {
    // Only use morgan if we aren't running tests.  It clutters up the test output.
    main.use(require('morgan')('combined', {
        stream: {
            write: (message) => {
                // Write to logs
                logger.log('info', message);
            }
        }
    }));
}

// Map the routes - this creates the controllers, and routes are mapped in each controller via the mapRoutes function called in each constructor
routes.map(main);

// custom 404 handler.  This will prevent html being returned for 404s.
main.use((req, res, next) => {
    res.status(404).json({error: "Not Found"});
});

// custom error handler.  This will prevent html being returned for errors.
main.use((err, req, res, next) => {
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

// site app - maps subdomains to site folders
var siteApp = express();
siteApp.use((req, res) => {
    const siteCode = req.vhost[0];
    req.originalUrl = req.url;
    let extension = '';
    if (!req.url.endsWith('.html')) {
        extension = '.html';
    }
    res.sendFile(__dirname + '/siteContent/' + siteCode + req.url + extension);
});

// Vhost app
var app = module.exports = express();

app.use(vhost(config.hostname, main)); // Serves top level domain via Main server app
app.use(vhost(`*.${config.hostname}`, siteApp)); // Serves all subdomains via siteApp

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
//module.exports = app;
module.exports = app;
