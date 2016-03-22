var express = require('express');
var router = express.Router();
//var pagesController = require('../pages/pagesController');
var CustomDataController = require('../customData/customDataController');
var CustomSchemasController = require('../customSchemas/customSchemasController');
//var sitesController = require("../sites/sitesController");

// todo: convert this to be more modular (one file in each folder that aggregates all the controllers inside it)
exports.map = function(app) {
    //pagesController.init(app);
    var customDataController = new CustomDataController(app);
    var customSchemasController = new CustomSchemasController(app);
    //sitesController.init(app);
};
