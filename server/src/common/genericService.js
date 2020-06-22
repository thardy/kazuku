'use strict';
const _ = require('lodash');
import Promise from 'bluebird';
const conversionService = require('./conversionService');
const ObjectId = require('mongodb').ObjectID;
import moment from 'moment';
const current = require('../common/current');

class GenericService {

    constructor(database, collectionName) {
        this.db = database;
        this.collection = database[collectionName];
    }

    getAll(orgId) {
        if (arguments.length !== 1) {
            return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.getAll'));
        }

        return this.collection.find({orgId: orgId})
            .then((docs) => {
                let friendlyDocs = [];
                _.forEach(docs, (doc) => {
                    this.useFriendlyId(doc);
                    friendlyDocs.push(doc);
                });

                // allow derived classes to transform the result
                return this.transformList(friendlyDocs);;
            });
    }

    getById(orgId, id) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.getById'));
        }
        if (!this.isValidObjectId(id)) {
            return Promise.reject(new TypeError('id is not a valid ObjectId'));
        }
        return this.collection.findOne({_id: id, orgId: orgId})
            .then((doc) => {
                this.useFriendlyId(doc);

                // allow derived classes to transform the result
                return this.transformSingle(doc);;
            });
    }

    find(orgId, mongoQueryObject, projection) {
        if (arguments.length < 2) { // need at least the first two
            return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.find'));
        }

        // Hardwire orgId into every query
        mongoQueryObject.orgId = orgId;

//        let projection = {
//            skip: mongoQuery.skip,
//            limit: mongoQuery.limit,
//            fields: mongoQuery.projection,
//            sort: mongoQuery.sort
//        };

        return this.collection.find(mongoQueryObject, projection)
            .then((docs) => {
                let friendlyDocs = [];
                _.forEach(docs, (doc) => {
                    this.useFriendlyId(doc);
                    friendlyDocs.push(doc);
                });

                // allow derived classes to transform the result
                return this.transformList(friendlyDocs);
            });
    }

    findOne(orgId, mongoQueryObject, projection) {
        if (arguments.length < 2) { // need at least the first two
            return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.find'));
        }

        // Hardwire orgId into every query
        mongoQueryObject.orgId = orgId;

        return this.collection.findOne(mongoQueryObject, projection)
            .then((doc) => {
                this.useFriendlyId(doc);

                // allow derived classes to transform the result
                return this.transformSingle(doc);
            });
    }

    create(orgId, doc) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.create'));
        }
        doc.orgId = orgId;
        let valError = this.validate(doc);
        if (valError) {
            return Promise.reject(new TypeError(valError));
        }

        conversionService.convertISOStringDateTimesToMongoDates(doc);

        return this.onBeforeCreate(orgId, doc)
            .then((result) => {
                return this.collection.insert(doc)
            })
            .then((doc) => {
                this.useFriendlyId(doc);
                return this.onAfterCreate(orgId, doc)
                    .then(() => { return doc }); // ignore the result of onAfter and return what the original call returned
            });
    }

    updateById(orgId, id, updatedDoc) {
        if (arguments.length !== 3) {
            return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.updateById'));
        }
        if (!this.isValidObjectId(id)) {
            return Promise.reject(new TypeError('id is not a valid ObjectId'));
        }
        let clone = _.clone(updatedDoc);
        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
        conversionService.convertISOStringDateTimesToMongoDates(clone);

        let queryObject = { _id: new ObjectId(id), orgId: orgId };
        // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
        return this.onBeforeUpdate(orgId, clone)
            .then((result) => {
                return this.collection.update(queryObject, {$set: clone})
            })
            .then((result) => {
                return this.onAfterUpdate(orgId, clone)
                    .then(() => { return result }); // ignore the result of onAfter and return what the original call returned
            });
    }

    // this is necessary for updating regenerate property to 0 without having BeforeUpdate set it to 1
    updateByIdWithoutCallingBeforeAndAfterUpdate(orgId, id, updatedDoc) {
        if (arguments.length !== 3) {
            return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.updateById'));
        }
        if (!this.isValidObjectId(id)) {
            return Promise.reject(new TypeError('id is not a valid ObjectId'));
        }
        let clone = _.clone(updatedDoc);
        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
        conversionService.convertISOStringDateTimesToMongoDates(clone);

        let queryObject = { _id: new ObjectId(id), orgId: orgId };
        // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
        return this.collection.update(queryObject, {$set: clone})
    }

    update(orgId, mongoQueryObject, updatedDoc) {
        if (arguments.length !== 3) {
            return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.update'));
        }
        let clone = _.clone(updatedDoc);
        delete clone.id;

        conversionService.convertISOStringDateTimesToMongoDates(clone);

        mongoQueryObject.orgId = orgId;

        return this.onBeforeUpdate(orgId, clone)
            .then((result) => {
                return this.collection.update(mongoQueryObject, {$set: clone});
            })
            .then((result) => {
                return this.onAfterUpdate(orgId, clone)
                    .then(() => { return result }); // ignore the result of onAfter and return what the original call returned
            });
    }

    // todo: Make Work!!! just started
//    updateBatch(orgId, updatedDocs) {
//        if (arguments.length !== 2) {
//            return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.updateBatch'));
//        }
//        let clone = _.clone(updatedDoc);
//        delete clone.id;
//
//        conversionService.convertISOStringDateTimesToMongoDates(clone);
//
//        mongoQueryObject.orgId = orgId;
//        return this.collection.update(mongoQueryObject, {$set: clone});
//    }

    delete(orgId, id) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.delete'));
        }
        if (!this.isValidObjectId(id)) {
            return Promise.reject(new TypeError('id is not a valid ObjectId'));
        }

        let queryObject = { _id: new ObjectId(id), orgId: orgId };
        return this.onBeforeDelete(orgId, queryObject)
            .then((result) => {
                return this.collection.remove(queryObject)
            })
            .then((result) => {
                return this.onAfterDelete(orgId, queryObject)
                    .then(() => { return result }); // ignore the result of onAfter and return what the original call returned
            });
    }

    validate(doc) {
        if (doc.orgId) {
            // simply do nothing if valid
            return;
        }
        else {
            return "Need orgId";
        }
    }

    useFriendlyId(doc) {
        if (doc && doc._id) {
            doc.id = doc._id.toHexString();
        }
    }

    isValidObjectId(id) {
        let result = false;
        if (typeof id === 'string' || id instanceof String) {
            result = id.match(/^[0-9a-fA-F]{24}$/);
        }
        return result;
    }

    auditForCreate(doc) {
        const now = moment().utc().toDate();
        const userId = current.context.user.email;
        doc.created = now;
        doc.createdBy = userId;
        doc.updated = now;
        doc.updatedBy = userId;
    }

    auditForUpdate(doc) {
        const userId = current.context.user.email;
        doc.updated = moment().utc().toDate(); //doc.updated = moment().utc().format('MM-DD-YYYY hh:mm:ss');
        doc.updatedBy = userId;
    }

    onBeforeCreate(orgId, doc) {
        this.auditForCreate(doc);
        return Promise.resolve(doc);
    }
    onBeforeUpdate(orgId, doc) {
        this.auditForUpdate(doc);
        return Promise.resolve(doc);
    }
    onBeforeDelete(orgId, doc) { return Promise.resolve(doc); }
    onAfterCreate(orgId, doc) { return Promise.resolve(doc); }
    onAfterUpdate(orgId, doc) { return Promise.resolve(doc); }
    onAfterDelete(orgId, queryObject) { return Promise.resolve(queryObject); }

    transformList(list) { return list; }
    transformSingle(single) { return single; }
}

module.exports = GenericService;