"use strict";
let _ = require("lodash");
let GenericService = require("../common/genericService");

class UserService extends GenericService {
    constructor(database) {
        super(database, 'users');
    }

    getByEmail(email) {
        return this.collection.findOne({email: email})
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


