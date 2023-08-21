import app from './app.js';
import config from './server/config/index.js';
import pureMongoService from './database/pureMongoService.js';

console.log('server.js - beginning'); // todo: deleteme
pureMongoService.connectDb()
    .then((db) => {
        app.listen(config.port, (err) => {
            console.log(`kazuku api listening on port ${config.port} (${config.env})`);
        });
    });



