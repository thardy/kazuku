"use strict";
const _ = require("lodash");
const GenericService = require("../common/genericService");
const User = require('./user.model');

class UserService extends GenericService {
    constructor() {
        super(User);
    }

    getByEmail(email) {
        return this.Model.findOne({email: email})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    validate(doc) {
        if (doc.email && doc.password) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return "Need email and password";
        }
    }

}

module.exports = UserService;


