//(function (pagesController) {
var authService = require('../authentication/authService');
// http://mikedeboer.github.io/node-github/
var GitHubApi  = require('github');

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    host: "api.github.com",
    timeout: 5000,
    headers: {
        "user-agent": "kazuku" // GitHub is happy with a unique user agent
    }
});

var pagesController = {};

pagesController.init = function (app) {
    app.get("/api/:siteCode/pages/:path", function (req, res) {
        var siteCode = req.params.siteCode;

        github.authenticate({
            type: 'oauth',
            token: authService.token
        });

        var msg = {
            user: 'thardy',
            repo: 'MarkdownTest',
            path: req.params.path
        };

        github.repos.getContent(msg, function(err, githubResult) {
            if (err) {
                console.log(err);
            }
            res.set("Content-Type", "application/json");
            var content = new Buffer(githubResult.content, 'base64').toString('utf8');
            res.send(content);
        });
    });

//        app.get('/do', function(req, res) {
//            var username = 'thardy';
//            var reponame = 'kazuku';
//            github.authenticate({
//                type: 'oauth',
//                token: token
//            });
//
//            github.repos.getAll({}, function(err, res) {
//                if (err) {
//                    console.log(err);
//                }
//                console.log('repos are ' + JSON.stringify(res));
//            });
//
//            res.send('tried to do something');
//            //repo.show(function(err, repo) {});
//        });
};

module.exports = pagesController;
//})(module.exports);