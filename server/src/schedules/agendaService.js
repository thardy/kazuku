const Agenda = require('agenda');
const config = require('../server/config');
// const database = require("../database/database").database;
const pureMongoService = require('../database/pureMongoService');

// latest try
let client = {};
let db = {};
let agenda = {};

(async () => {
    // connect to the database
    await pureMongoService.connectDb();
    agenda = new Agenda({mongo: pureMongoService.db});
    // agenda = new Agenda({mongo: database.db});

    await agenda.start();
})();

module.exports = agenda;


// second to latest try
// class AgendaService {
//     constructor(pureMongoDb) {
//         this.agenda = new Agenda({mongo: pureMongoDb});
//     }
//
//
//     async start() {
//         await this.agenda.start();
//     }
//
// }
//
// module.exports = AgendaService;




// let agenda;
// pureMongoDb((connectedDb) => {
//     agenda = new Agenda({mongo: connectedDb});
// });

// module.exports = agenda;