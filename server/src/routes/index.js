var express = require('express');
var router = express.Router();
var pagesController = require('../pages/pagesController');
var customDataController = require('../customData/customDataController');
var customSchemasController = require('../customData/customSchemasController');
//var sitesController = require("../sites/sitesController");

// todo: convert this to be more modular (one file in each folder that aggregates all the controllers inside it)
exports.map = function(app) {
    pagesController.init(app);
    customDataController.init(app);
    customSchemasController.init(app);
    //sitesController.init(app);
};
