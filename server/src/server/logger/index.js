'use strict';

import winston from 'winston';
// equivalent to - require('./winston/logger').Logger
const logger = winston.createLogger({
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

export default logger;