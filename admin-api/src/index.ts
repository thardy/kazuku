import { app, setupExpress } from '#root/app';
import database from '#server/database/database';
import config from '#server/config/config';

const startServer = async () => {
  console.log('Starting kazuku-admin-api server...');
  console.log(`inside startServer - process.env.NODE_ENV = ${process.env.NODE_ENV} and process.env.KAZUKU_ENV = ${process.env.KAZUKU_ENV}`); // todo: delete me once we get env stuff working

  // ensure we have all required config values
  checkForRequiredConfigValues();

  try {
    console.log(`config.mongoDbUrl = ${config.mongoDbUrl}. config.databaseName = ${config.databaseName}`);
    await database.connect(config.mongoDbUrl, config.databaseName);

    // we need db to be ready before setting up express - all the controllers need it when they get instantiated
    setupExpress(database.db!);
  }
  catch(err) {
    console.error(err);
  }

  if (database.db) {
    app.listen(3000, () => {
      //console.log('kazuku-admin-api listening on port 3000!');
      console.log(`kazuku-admin-api listening on port ${config.port} (${config.env})`);
    });
  }
  else {
    cleanup('DATABASE_CONNECTION_ERROR');
  }
};

const checkForRequiredConfigValues = () => {
  // todo: add all required config values to this check
  if (!config.clientSecret) {
    throw new Error('config.clientSecret is not defined');
  }
}

// ******** Shutdown Cleanup Begin ********
const cleanup = (event: any) => {
  console.log(`kazuku-admin-api server stopping due to ${event} event. running cleanup...`);
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
// ******** Shutdown Cleanup End ********


startServer();
