"use strict";
let _ = require("lodash");
let GenericService = require("../common/genericService");

class UserService extends GenericService {
    constructor(database) {
        super(database, 'users');
    }

    getByUserName(username) {
        return this.collection.findOne({username: username})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    validate(doc) {
        if (doc.username && doc.password) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return "Need username and password";
        }
    }

}

module.exports = UserService;


