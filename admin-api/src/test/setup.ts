import { MongoMemoryServer } from 'mongodb-memory-server';
import {app, setupExpress} from '#root/app';
import {MongoClient} from 'mongodb';
import testUtils from '#test/test.utils';
import config from '#server/config/config';

let mongo: MongoMemoryServer;
let mongoClient: MongoClient;

beforeAll(async () => {
  mongo = await  MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  // connect mongodb driver to the in-memory database
  mongoClient = new MongoClient(mongoUri, {});
  await mongoClient.connect();

  const db = mongoClient.db(config.databaseName);
  testUtils.initialize(app, db);
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
  //await testUtils.deleteAllTestOrgs(); // why bother if we are just going to drop the db?

  if (mongoClient) {
    await mongoClient.close();
  }
  if (mongo) {
    await mongo.stop();
  }
});
