import config from '../server/config/index.js';
import mongoDb from 'mongodb';

// latest
class PureMongoService {
    constructor() {
        this.client = null;
        this.db = null;
        this.cachedPromise = null;
    }

    // async connectDb() {
    //     // ignore if we've already connected (some tests require me to kick this off independently)
    //     if (!this.db) {
    //         console.log('pureMongoService.js - connecting to mongoDb'); // todo: deleteme
    //         this.client = await mongoDb.MongoClient.connect(config.mongoDbUrl, {useUnifiedTopology: true, useNewUrlParser: true});
    //         console.log('mongoDb connected');
    //
    //         this.db = this.client.db(config.databaseName);
    //         // this.Users = new Users(this.db);
    //     }
    //     console.log('pureMongoService.js - returning existing client'); // todo: deleteme
    //     return this.client;
    // }
    connectDb() {
        if (!this.cachedPromise) {
            console.log('pureMongoService.js - connecting to mongoDb'); // todo: deleteme
            this.cachedPromise = mongoDb.MongoClient.connect(config.mongoDbUrl, {useUnifiedTopology: true, useNewUrlParser: true})
                .then((client) => {
                    console.log('pureMongoService.js - entering then'); // todo: deleteme
                    this.client = client;
                    this.db = client.db(config.databaseName);
                    console.log('mongoDb connected');
                    return this.db;
                })
                .catch((err) => {
                    // clear cached promise on failure so we can try again
                    this.cachedPromise = undefined;
                });
        }
        console.log('pureMongoService.js - returning the promise'); // todo: deleteme
        return this.cachedPromise;

        // ignore if we've already connected (some tests require me to kick this off independently)
        // let promise = null;
        // if (!this.db) {
        //     console.log('pureMongoService.js - connecting to mongoDb'); // todo: deleteme
        //     promise = mongoDb.MongoClient.connect(config.mongoDbUrl, {useUnifiedTopology: true, useNewUrlParser: true})
        //         .then((client) => {
        //             console.log('pureMongoService.js - entering then'); // todo: deleteme
        //             this.client = client;
        //             this.db = this.client.db(config.databaseName);
        //             console.log('mongoDb connected');
        //             return this.client;
        //         });
        // }
        // else {
        //     console.log('pureMongoService.js - returning existing client'); // todo: deleteme
        //     promise = Promise.resolve(this.client);
        // }
        // return promise;
    }
}

//export default new PureMongoService();
const pureMongoService = new PureMongoService();
export default pureMongoService;

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
