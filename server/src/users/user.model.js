const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    orgId: mongoose.Schema.ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    lastLoggedIn: Date,
    created: { type: Date, default: Date.now },
    createdBy: mongoose.Schema.ObjectId,
    updated: { type: Date, default: Date.now },
    updatedBy: mongoose.Schema.ObjectId
});

let User = mongoose.model('user', userSchema);

module.exports = User;