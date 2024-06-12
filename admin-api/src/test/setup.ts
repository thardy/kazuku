import { MongoMemoryServer } from 'mongodb-memory-server';
import {MongoClient} from 'mongodb';
import {setCommonConfig} from '@kazuku-cms/common';

import {app, setupExpress} from '#root/app';
import testUtils from '#test/test.utils';
import config from '#server/config/config';
import testApiUtils from '#test/test-api.utils';

let mongo: MongoMemoryServer;
let mongoClient: MongoClient;

beforeAll(async () => {
  setCommonConfig(config.commonConfig);
  mongo = await  MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  // connect mongodb driver to the in-memory database
  mongoClient = new MongoClient(mongoUri, {});
  await mongoClient.connect();

  const db = mongoClient.db(config.databaseName);
  testUtils.initialize(db);
  testApiUtils.initialize(app);
  await testUtils.createIndexes(db);
  await testUtils.setupTestOrgs();

  setupExpress(db);
});

beforeEach(async () => {
  // const collections = await mongoClient.db().collections();

  // todo: change this to be more targeted
  // delete all data in all collections before each test
  // for (let collection of collections) {
  //   await collection.deleteMany({});
  // }
});

afterAll(async () => {
  //await testUtils.deleteAllTestOrgs(); // why bother if we are just going to drop the in-memory db?

  if (mongoClient) {
    await mongoClient.close();
  }
  if (mongo) {
    await mongo.stop();
  }
});
