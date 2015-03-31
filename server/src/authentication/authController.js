//(function (authController) {
var request = require('request');
var config = require("../env-config");
var authService = require("./authService");

exports.init = function (app) {

    app.get('/auth', function (req, res) {
        var auth_uri = 'https://github.com/login/oauth/authorize?client_id={0}&redirect_uri={1}&scope={2}&state={3}'.format(
            config.githubClientId,
            'http://localhost:3000/gitcallback',
            'repo',
            '0#a9!5)72J#0/!L~' // todo: create random hash (based off date-time or sumpin), then place in session and verify param is returned verbatim
        );
        res.redirect(auth_uri);
    });

    app.get('/gitcallback', function (req, res) {
        var code = req.query.code;
        console.log('/gitcallback');
        var form = {
            client_id: config.githubClientId,
            client_secret: config.githubClientSecret,
            code: code,
            redirect_uri: 'http://localhost:3000/gitcallback'
        };

        request.post({
                method: 'POST',
                url: 'https://github.com/login/oauth/access_token',
                body: form,
                json: true
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    authService.token = body.access_token;
                    res.send('got a token');
                }
            }
        );
    });
};
