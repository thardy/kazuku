"use strict";
const _ = require("lodash");
const GenericService = require("../common/genericService");
const Promise = require('bluebird');
const conversionService = require("../common/conversionService");
const config = require('../server/config');

class OrganizationService extends GenericService {
    constructor(database) {
        super(database, 'organizations');
    }

    getAll() {
        return this.collection.find({})
            .then((docs) => {
                let transformedDocs = [];
                _.forEach(docs, (doc) => {
                    this.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            });
    }

    getById(id) {
        if (arguments.length !== 1) {
            return Promise.reject(new Error('Incorrect number of arguments passed to OrganizationService.getById'));
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

    getByName(name) {
        return this.collection.findOne({name: name})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    getByCode(code) {
        return this.collection.findOne({code: code})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    findOne(mongoQueryObject, projection) {
        if (arguments.length < 1) { // need at least the queryObject
            return Promise.reject(new Error('Incorrect number of arguments passed to OrganizationService.findOne'));
        }

        return this.collection.findOne(mongoQueryObject, projection)
            .then((doc) => {
                this.useFriendlyId(doc);

                return doc;
            });
    }

    create(doc) {
        if (arguments.length !== 1) {
            return Promise.reject(new Error('Incorrect number of arguments passed to OrganizationService.create'));
        }

        let valError = this.validate(doc);
        if (valError) {
            return Promise.reject(new TypeError(valError));
        }

        conversionService.convertISOStringDateTimesToMongoDates(doc);

        return this.onBeforeCreate(null, doc)
            .then((result) => {
                return this.collection.insert(doc)
            })
            .then((doc) => {
                this.useFriendlyId(doc);
                return this.onAfterCreate(null, doc)
                    .then(() => { return doc }); // ignore the result of onAfter and return what the original call returned
            });
    }

    updateById(id, updatedDoc) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error('Incorrect number of arguments passed to OrganizationService.updateById'));
        }
        if (!this.isValidObjectId(id)) {
            return Promise.reject(new TypeError('id is not a valid ObjectId'));
        }
        let clone = _.clone(updatedDoc);
        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
        conversionService.convertISOStringDateTimesToMongoDates(clone);

        let queryObject = { _id: id };
        // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
        return this.onBeforeUpdate(null, clone)
            .then((result) => {
                return this.collection.update(queryObject, {$set: clone})
            })
            .then((result) => {
                return this.onAfterUpdate(null, clone)
                    .then(() => { return result }); // ignore the result of onAfter and return what the original call returned
            });
    }

    delete(id) {
        if (arguments.length !== 1) {
            return Promise.reject(new Error('Incorrect number of arguments passed to OrganizationService.delete'));
        }
        if (!this.isValidObjectId(id)) {
            return Promise.reject(new TypeError('id is not a valid ObjectId'));
        }

        let queryObject = { _id: id };
        return this.onBeforeDelete(null, queryObject)
            .then((result) => {
                return this.collection.remove(queryObject)
            })
            .then((result) => {
                return this.onAfterDelete(null, queryObject)
                    .then(() => { return result }); // ignore the result of onAfter and return what the original call returned
            });
    }

    validate(doc) {
        let valid = false;
        if (doc.name && doc.code) {
            // don't call base because this is the one doc that does not need an orgId to create
            return;
        }
        else {
            return 'Need name and code to create organization';
        }
    }

}


module.exports = OrganizationService;
