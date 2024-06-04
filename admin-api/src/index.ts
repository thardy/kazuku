//import 'module-alias/register';
import moduleAlias from 'module-alias';
// We need to do this here or else Docker gets confused between dist and src directories
moduleAlias.addAliases({
  "@root": `${__dirname}`,
  "@common": `${__dirname}/common`,
  "@features": `${__dirname}/features`,
  "@server": `${__dirname}/server`
});
import { app, setupExpress } from '@root/app';
import database from '@server/database/database';
import config from '@server/config';

const startServer = async () => {
  console.log('Starting kazuku-admin-api server...');
  console.log(`inside startServer - process.env.NODE_ENV = ${process.env.NODE_ENV} and process.env.KAZUKU_ENV = ${process.env.KAZUKU_ENV}`); // todo: delete me once we get env stuff working

  // ensure we have all required config values
  checkForRequiredConfigValues();

  try {
    console.log(`config.mongoDbUrl = ${config.mongoDbUrl}. config.databaseName = ${config.databaseName}`);
    await database.connect(config.mongoDbUrl, config.databaseName);
    //await database.connect('mongodb://kazuku-mongodb-svc:27017', 'kazuku');

    // we need db to be ready before setting up express - all the controllers need it when they get instantiated
    setupExpress();
  }
  catch(err) {
    console.error(err);
  }

  app.listen(3000, () => {
    //console.log('kazuku-admin-api listening on port 3000!');
    console.log(`kazuku-admin-api listening on port ${config.port} (${config.env})`);
  });
};

const checkForRequiredConfigValues = () => {
  // todo: add all required config values to this check
  if (!config.clientSecret) {
    throw new Error('config.clientSecret is not defined');
  }
}

// ***** Shutdown Cleanup Begin *****
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
// ***** Shutdown Cleanup End *****

startServer();
