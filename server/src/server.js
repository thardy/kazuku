// const mongoose = require('mongoose');
// const util = require('util');

// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');

const debug = require('debug')('kazuku:server');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
//mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
// mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
// mongoose.connection.on('error', () => {
//     throw new Error(`unable to connect to database: ${mongoUri}`);
// });

// print mongoose logs in dev env
// if (config.MONGOOSE_DEBUG) {
//     mongoose.set('debug', (collectionName, method, query, doc) => {
//         debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
//     });
// }

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
    // listen on port config.port
    app.listen(config.port, () => {
        console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
    });
}

module.exports = app;


// var express = require('express');
// var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
// var routes = require('./routes');
// var config = require("./env-config");
// var utils = require('./utils');
//
// var app = express();
// app.use(bodyParser.json());
// app.use(cookieParser());
// //app.use(utils.errorHandler.init); // doesn't appear to be working
//
// // Map the routes
// routes.map(app);
//
// app.get('/', function (req, res) {
//     res.send('Hello<br><a href="/auth">Log in with Github</a>');
// });
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
//
// // error handlers
// // development error handler
// // will print stacktrace
// if (config.environment === 'dev') {
//     app.use(function(err, req, res, next) {
//         console.log(err.message);
//         res.status(err.status || 500);
//         res.json({
//             message: err.message,
//             error: err
//         });
//     });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     console.log(err.message);
//     res.status(err.status || 500);
//     res.json({
//         message: err.message
//     });
// });
//
// module.exports = app;
