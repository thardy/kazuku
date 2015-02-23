var express = require('express');
var router = express.Router();
var pagesController = require('../pages/pagesController');
//var sitesController = require("../sites/sitesController");

exports.map = function(app) {
    pagesController.init(app);
    //sitesController.init(app);
};
