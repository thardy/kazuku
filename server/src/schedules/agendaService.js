const Agenda = require('agenda');
const config = require('../server/config');
// const mongoClient = require("../database/pureMongo").client;
//const { db } = require("../database/pureMongoService");
const db = require('monk')('localhost/mydb')

// latest try
class AgendaService {
    constructor(db) {
        this.agenda = new Agenda({mongo: db});
    }
}

module.exports = new AgendaService(db);

// const mongoDb = require('mongodb');
//
// let client = {};
// let db = {};
// let agenda = {};
//
// (async () => {
//     // connect to the database
//     client = await mongoDb.MongoClient.connect(config.mongoDbUrl,{ useUnifiedTopology: true, useNewUrlParser:true });
//     db = client.db();
//     agenda = new Agenda({mongo: client.db('kazuku')});
//
//     await agenda.start();
// })();
//
// module.exports = agenda;


// let agenda;
// pureMongoDb((connectedDb) => {
//     agenda = new Agenda({mongo: connectedDb});
// });

// module.exports = agenda;