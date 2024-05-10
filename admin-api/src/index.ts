import 'module-alias/register';
import { app, setupExpress } from '@root/app';
import database from '@server/database/database';

const startServer = async () => {
  console.log('Starting kazuku-admin-api server...');
  try {
    await database.connect('mongodb://kazuku-mongodb-svc:27017', 'kazuku');

    // we need db to be ready before setting up express - all the controllers need it when they get instantiated
    setupExpress();
  }
  catch(err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('kazuku-admin-api listening on port 3000!');
    //console.log(`kazuku-admin-api listening on port ${config.port} (${config.env})`);
  });
};

startServer();


// ***** Shutdown Cleanup *****
const cleanup = (event: any) => {
  // clean stuff up here
  const client = database.client;
  if (client) {
    console.log('closing mongodb connection');
    client.close(); // Close MongodDB Connection when Process ends
  }
  process.exit(); // Exit with default success-code '0'.
};

// SIGINT is sent for example when you Ctrl+C a running process from the command line.
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// just a test comment
