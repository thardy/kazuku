"use strict";
var _ = require("lodash");
var Promise = require("bluebird");

class PublishingService {

    constructor(database) {
        this._db = database;

    }

    get db() { return this._db; }

}

module.exports = PublishingService;