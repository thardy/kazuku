'use strict';

const winston = require('winston');
// equivalent to - require('./winston/logger').Logger
const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            level: 'debug',
            filename: './kazukuDebug.log',
            handleExceptions: true
        }),
        new (winston.transports.Console)({
            level: 'debug',
            json: true,
            handleExceptions: true
        })
    ],
    exitOnError: false
});

module.exports = logger;