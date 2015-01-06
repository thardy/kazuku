var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var controllers = require("./controllers");
var utils = require("./utils");
var config = require("./env-config");
var url = require('url');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Map the routes
controllers.init(app);

var oauth2 = require('simple-oauth2')({
    clientID: config.githubClientId,
    clientSecret: config.githubClientSecret,
    site: 'https://github.com/login',
    tokenPath: '/oauth/access_token'
});

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
    redirect_uri: 'http://localhost:3000/gitcallback',
    scope: 'repo',
    state: '0#a9!5)72J#0/!L~'
});

// Initial page redirecting to Github
app.get('/auth', function (req, res) {
    res.redirect(authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/gitcallback', function (req, res) {
    var code = req.query.code;
    console.log('/gitcallback');
    oauth2.authCode.getToken({
        code: code,
        redirect_uri: 'http://localhost:3000/gitcallback'
    }, saveToken);

    function saveToken(error, result) {
        if (error) { console.log('Access Token Error', error.message); }
        token = oauth2.accessToken.create(result);
    }
});

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
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//console.log("test string is {0}".format('SUCKA'));


module.exports = app;
