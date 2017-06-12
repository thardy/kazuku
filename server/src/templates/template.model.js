const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    orgId: mongoose.Schema.ObjectId,
    siteId: mongoose.Schema.ObjectId,
    name: String,
    layout: String,
    template: String,
    dependencies: {
        type: [{ type: String, name: String}],
        default: undefined
    },
    regenerate: Boolean,
    created: { type: Date, default: Date.now },
    createdBy: mongoose.Schema.ObjectId,
    updated: { type: Date, default: Date.now },
    updatedBy: mongoose.Schema.ObjectId
});

let Template = mongoose.model('template', templateSchema);

module.exports = Template;