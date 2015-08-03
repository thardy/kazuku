var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var routes = require('./routes');
var config = require("./env-config");
//var utils = require('./utils');

var app = express();
app.use(bodyParser.json());
app.use(cookieParser());
//app.use(utils.errorHandler.init); // doesn't appear to be working

// Map the routes
routes.map(app);

app.get('/', function (req, res) {
    res.send('Hello<br><a href="/auth">Log in with Github</a>');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (config.environment === 'dev') {
    app.use(function(err, req, res, next) {
        console.log(err.message);
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log(err.message);
    res.status(err.status || 500);
    res.json({
        message: err.message
    });
});

module.exports = app;
