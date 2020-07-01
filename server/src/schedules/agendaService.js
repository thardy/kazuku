import Agenda from 'agenda';
import config from '../server/config/index.js';
// import {database} from '../database/database.js';
import pureMongoService from '../database/pureMongoService.js';
import SchemaService from '../server/graphQL/schemaService.js';

// latest try
// let client = {};
// let db = {};
// let agenda = {};
//
// (async () => {
//     // connect to the database
//     // agenda = new Agenda({mongo: pureMongoService.db});
//     agenda = new Agenda({mongo: database.db});
//
//     await agenda.start();
// })();
//
// export default agenda;

// This is a good example of how to do an async export - we'll get it to you as soon as it's ready
let callbackList = [];
let agenda;

(async () => {
    // connect to the database
    await pureMongoService.connectDb();
    agenda = new Agenda({mongo: pureMongoService.db});

    await agenda.start();

    // Call all the modules who asked for agenda when it wasn't ready yet and give it to them
    for (let i = 0; i < callbackList.length; i++) {
        callbackList[i](agenda);
    }
})();

export default (callback) => {
    if (typeof agenda != 'undefined'){
        callback(agenda); // If agenda is already defined, give it to them immediately
    } else {
        callbackList.push(callback);
    }
};


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