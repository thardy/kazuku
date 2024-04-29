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

const cleanup = (event) => { // SIGINT is sent for example when you Ctrl+C a running process from the command line.
    const client = pureMongoService.client;
    if (client) {
        client.close(); // Close MongodDB Connection when Process ends
    }
    process.exit(); // Exit with default success-code '0'.
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

