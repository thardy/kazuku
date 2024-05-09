import { MongoClient, Db } from 'mongodb';

// latest
class Database {
  client?: MongoClient;
  db?: Db;
  private cachedPromise?: any;

  constructor() {
  }

  connect(mongoDbUrl: string, dbName: string) {
    this.client = new MongoClient(mongoDbUrl);

    if (!this.cachedPromise) {
      console.log('database - connecting to mongoDb...');
      this.cachedPromise = this.client.connect()
        .then((client) => {
          this.db = client.db(dbName);
          console.log('...connected to mongoDb!');
          return this.db;
        })
        .catch((err: Error) => {
          console.error(err);
          // clear cached promise on failure so we can try again
          this.cachedPromise = undefined;
        });
    }
    return this.cachedPromise;
  }
}

export default new Database();
