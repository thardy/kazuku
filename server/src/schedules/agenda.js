const Agenda = require('agenda');
const config = require('../server/config');

// todo: split this export out from the actual scheduling stuff below it
const agenda = new Agenda({db: {address: config.mongoDbUrl, collection: 'agendaJobs'}});

module.exports = agenda;