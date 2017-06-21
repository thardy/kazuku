const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    orgId: mongoose.Schema.ObjectId,
    siteId: mongoose.Schema.ObjectId,
    name: String,
    query: String,
    results: [{}],
    dependencies: [{}],
    regenerate: Boolean,
    created: { type: Date, default: Date.now },
    createdBy: mongoose.Schema.ObjectId,
    updated: { type: Date, default: Date.now },
    updatedBy: mongoose.Schema.ObjectId
});

let Query = mongoose.model('query', querySchema);

module.exports = Query;
