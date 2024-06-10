import { MongoMemoryServer } from 'mongodb-memory-server';
import {app, setupExpress} from '#root/app';
import {Db, MongoClient} from 'mongodb';
import testUtils from '#test/test.utils';
import config from '#server/config/config';

let mongo: MongoMemoryServer;
let mongoClient: MongoClient;
let db: Db;

beforeAll(async () => {
  mongo = await  MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  // connect mongodb driver to the in-memory database
  mongoClient = new MongoClient(mongoUri, {});
  await mongoClient.connect();

  const db = mongoClient.db(config.databaseName);
  testUtils.initialize(db);
  testUtils.createIndexes(db);
  setupExpress(db);
});

beforeEach(async () => {
  const collections = await mongoClient.db().collections();

  // todo: change this to be more targeted
  // delete all data in all collections before each test
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongoClient) {
    await mongoClient.close();
  }
  if (mongo) {
    await mongo.stop();
  }
});
