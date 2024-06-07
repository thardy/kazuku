import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '#root/app';
import {MongoClient} from 'mongodb';

let mongo: MongoMemoryServer;
let mongoClient: MongoClient;

console.log('inside setup.ts');

beforeAll(async () => {
  const mongo = await  MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  // connect mongodb driver to the in-memory database
  mongoClient = new MongoClient(mongoUri, {});
  await mongoClient.connect();
});

beforeEach(async () => {
  const collections = await mongoClient.db().collections();

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
