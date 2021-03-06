#!/usr/bin/env node
'use strict';
// const config = require('../src/server/config');
import config from '../src/server/config/index.js';

// var debug = require('debug')('server');
// const server = require('../src/server');
import server from '../src/server.js';

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
// if (!module.parent) {
//     // listen on port config.port
//     app.listen(config.port, () => {
//         console.log(`kazuku server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
//     });
// }

server(config);