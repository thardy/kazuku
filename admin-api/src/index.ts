import {Db, MongoClient} from 'mongodb';
import {setCommonConfig} from '@kazuku-cms/common';

import { app, setupExpress } from '#root/app';
import config from '#server/config/config';
// import testUtils from '#test/test.utils';

let mongoClient: MongoClient;
let db: Db;

const startServer = async () => {
  console.log('Starting kazuku-admin-api server...');
  console.log(`inside startServer - process.env.NODE_ENV = ${process.env.NODE_ENV} and process.env.KAZUKU_ENV = ${process.env.KAZUKU_ENV}`); // todo: delete me once we get env stuff working

  // ensure we have all required config values
  checkForRequiredConfigValues();
  setCommonConfig(config.commonConfig);

  try {
    mongoClient = new MongoClient(config.mongoDbUrl);
    console.log('connecting to mongoDb...');
    await mongoClient.connect();
    db = mongoClient.db(config.databaseName);
    console.log('...connected to mongoDb');

    // we need db to be ready before setting up express - all the controllers need it when they get instantiated
    setupExpress(db);

    // todo: temporary until we get mongoDb persistent volumes setup - delete as soon as we do
    // await setupManualTestData(db);
  }
  catch(err) {
    console.error(err);
  }

  if (db!) {
    app.listen(3000, () => {
      //console.log('kazuku-admin-api listening on port 3000!');
      console.log(`kazuku-admin-api listening on port 3000 (${config.env})`);
    });
  }
  else {
    cleanup('DATABASE_CONNECTION_ERROR');
  }
};


const checkForRequiredConfigValues = () => {
  // todo: add all required config values to this check
  if (!config.commonConfig.clientSecret) { throw new Error('config.commonConfig.clientSecret is not defined'); }
}

// ******** Shutdown Cleanup Begin ********
const cleanup = (event: any) => {
  console.log(`kazuku-admin-api server stopping due to ${event} event. running cleanup...`);
  // clean stuff up here
  if (mongoClient) {
    console.log('closing mongodb connection');
    mongoClient.close(); // Close MongodDB Connection when Process ends
  }
  process.exit(); // Exit with default success-code '0'.
};

// SIGINT is sent for example when you Ctrl+C a running process from the command line.
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
// ******** Shutdown Cleanup End ********

// const setupManualTestData = async (db: any) => {
//   testUtils.initialize(db);
//   await testUtils.setupTestOrgs();
//   await testUtils.setupTestUsers();
// };


startServer();
