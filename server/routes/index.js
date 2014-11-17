var express = require('express');
var fs = require("fs");
var marked = require('marked');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Kazuku' });
});

router.get('/marktest/:file', function(req, res) {
    //var markdownString = '# This is an H1\n## This is an H2\n### This is an H3';
    //var filename = "./public/markdown/somemarkdown.md";
    fs.readFile("./public/markdown/{0}.md".format(req.param("file")), 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        marked(data, function (err, content) {
            if (err) {
                throw err;
            }

            res.setHeader('Content-Type', 'text/html')
            res.end(content);
        })
    });

    // Using async version of marked
//    marked(markdownString, function (err, content) {
//        if (err) {
//            throw err;
//        }
//
//        res.setHeader('Content-Type', 'text/html')
//        res.end(content);
//    });

});

module.exports = router;
