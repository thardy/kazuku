const Agenda = require('agenda');

// latest try
class AgendaService {
    constructor(pureMongoDb) {
        this.agenda = new Agenda({mongo: pureMongoDb});
    }
}

module.exports = AgendaService;

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