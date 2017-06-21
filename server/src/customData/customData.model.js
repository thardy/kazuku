const mongoose = require('mongoose');

// Mongoose Mixed schema type, so we can put whatever we want in here - http://mongoosejs.com/docs/schematypes.html
// https://stackoverflow.com/questions/24674909/trouble-with-mongoose-and-schema-types-mixed
const customDataSchema = new mongoose.Schema({},{ 'strict': false, collection: 'customData' });

let CustomData = mongoose.model('customData', customDataSchema);

module.exports = CustomData;
