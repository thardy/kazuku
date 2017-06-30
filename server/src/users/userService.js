"use strict";
const _ = require("lodash");
const GenericService = require("../common/genericService");
const Promise = require('bluebird');
const conversionService = require("../common/conversionService");
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
const config = require('../server/config');

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

    create(orgId, user) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to UserService.create');
        }
        user.orgId = orgId;
        let valError = this.validate(user);
        if (valError) {
            return Promise.reject(new TypeError(valError));
        }

        conversionService.convertISOStringDateTimesToMongoDates(user);

        return this.hashPassword(user.password)
            .then((hash) => {
                user.password = hash;
                return this.onBeforeCreate(orgId, user)
            })
            .then((result) => {
                return this.collection.insert(user)
            })
            .then((user) => {
                this.useFriendlyId(user);
                if (user) {
                    delete user.password;
                }
                return this.onAfterCreate(orgId, user)
                    .then(() => { return user }); // ignore the result of onAfterCreate and return what the original call returned
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

    hashPassword(password) {
        // generate a salt and use it to make the hash
        return bcrypt.genSaltAsync(config.saltWorkFactor)
            .then((salt) => {
                return bcrypt.hashAsync(password, salt, null);
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    verifyPassword(candidatePassword, hashedPassword) {
        return bcrypt.compareAsync(candidatePassword, hashedPassword);
    }
}


module.exports = UserService;

