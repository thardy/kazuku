var express = require('express');
var router = express.Router();
var pagesController = require('../pages/pagesController');
var customDataController = require('../customData/customDataController');
//var sitesController = require("../sites/sitesController");

exports.map = function(app) {
    pagesController.init(app);
    customDataController.init(app);
    //sitesController.init(app);
};
