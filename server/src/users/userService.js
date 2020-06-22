"use strict";
import _ from 'lodash';
import GenericService from '../common/genericService.js';
import Promise from 'bluebird';
import conversionService from '../common/conversionService.js';
import bcryptNodejs from 'bcrypt-nodejs';
const bcrypt = Promise.promisifyAll(bcryptNodejs);
import config from '../server/config/index.js';

class UserService extends GenericService {
    constructor(database) {
        super(database, 'users');
    }

    getById(id) {
        if (arguments.length !== 1) {
            return Promise.reject(new Error('Incorrect number of arguments passed to UserService.getById'));
        }
        if (!this.isValidObjectId(id)) {
            return Promise.reject(new TypeError('id is not a valid ObjectId'));
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
            return Promise.reject(new Error('Incorrect number of arguments passed to UserService.create'));
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
                    this.cleanUser(user);
                }
                return this.onAfterCreate(orgId, user)
                    .then(() => { return user }); // ignore the result of onAfterCreate and return what the original call returned
            });
    }

    validate(doc) {
        // todo: update to handle social auth (which might not have email or password)
        let valid = false;
        if (doc.email && doc.password
            || doc.facebook && doc.facebook.id
            || doc.google && doc.google.id) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return "Need email and password, or facebook id, or google id";
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

    cleanUser(user) {
        // Remove any sensitive information
        delete user.password;
        if (user.facebook) {
            delete user.facebook.token;
        }
        if (user.google) {
            delete user.google.token;
        }
    }

    transformList(users) {
        return users.map((user) => {
            this.cleanUser(user);
            return user;
        });
    }

    transformSingle(user) {
        this.cleanUser(user);
        return user;
    }
}


export default UserService;

