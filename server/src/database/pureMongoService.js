const config = require('../server/config');
const mongoDb = require('mongodb');

// latest
class PureMongoService {
    constructor() {
        // this.client = new MongoClient(url, conf.opts);
    }

    async connectDb() {
        // ignore if we've already connected (some tests require me to kick this off independently)
        if (!this.db) {
            this.client = await mongoDb.MongoClient.connect(config.mongoDbUrl, {useUnifiedTopology: true, useNewUrlParser: true});
            console.log('mongoDb connected');

            this.db = this.client.db(config.databaseName);
            // this.Users = new Users(this.db);
        }

        return this.client;
    }
}

module.exports = new PureMongoService();

// almost latest
// let _db;
//
// const connectDb = async (callback) => {
//     await new Promise((resolve, reject) =>{
//         mongoDb.MongoClient.connect(config.mongoDbUrl,{ useUnifiedTopology: true, useNewUrlParser:true }, (err, db) => {
//             if (err) {
//                 reject();
//             }
//             else {
//                 _db = db;
//                 resolve();
//             }
//         });
//     });
//
//
//
//
//     const client =
//     _db = client.db(config.databaseName);
// };
//
// const getDb = () => { return _db; };
//
// module.exports = {
//     connectDb: connectDb,
//     getDb: getDb
// };


// first try
// let client = {};
// let db = {}
//
// (async () => {
//     // connect to the database
//     client = await mongoDb.MongoClient.connect(config.mongoDbUrl,{ useUnifiedTopology: true, useNewUrlParser:true });
//     db = client.db(config.databaseName);
// })();
//
// module.exports = {
//     client: client,
//     db: db,
// };

// second try
// let db, callbackList = [];
//
// (async () => {
//     // connect to the database
//     const client = await mongoDb.MongoClient.connect(config.mongoDbUrl,{ useUnifiedTopology: true, useNewUrlParser: true });
//     const db = client.db(config.databaseName);
//
//     // publish the result
//     for (let i = 0; i < callbackList.length; i++){
//         callbackList[i](db);
//     }
// })();
//
// module.exports = (cb) => {
//     if (typeof db != 'undefined') {
//         cb(db); // if db is already defined, don't wait.
//     }
//     else {
//         callbackList.push(cb);
//     }
// };
