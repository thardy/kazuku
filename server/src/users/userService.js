"use strict";
const _ = require("lodash");
const GenericService = require("../common/genericService");

class UserService extends GenericService {
    constructor(database) {
        super(database, 'users');
    }

    getById(id) {
        if (arguments.length !== 1) {
            throw new Error('Incorrect number of arguments passed to UserService.getById');
        }
        return this.collection.findOne({_id: id})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
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

