"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var conversionService = require("./conversionService");

class GenericService {

    constructor(database, collectionName) {
        this.db = database;
        this.collection = database[collectionName];
    }

    getAll(orgId) {
        if (arguments.length !== 1) {
            throw new Error('Incorrect number of arguments passed to GenericService.getAll');
        }

        return this.collection.find({orgId: orgId})
            .then((docs) => {
                var transformedDocs = [];
                _.forEach(docs, (doc) => {
                    this.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            });
    }

    getById(orgId, id) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to GenericService.getById');
        }
        if (!this.isValidObjectId(id)) {
            throw new TypeError('id is not a valid ObjectId');
        }
        return this.collection.findOne({_id: id, orgId: orgId})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    find(orgId, mongoQueryObject, projection) {
        if (arguments.length < 2) { // need at least the first two
            throw new Error('Incorrect number of arguments passed to CustomDataService.find');
        }

        // Hardwire orgId into every query
        mongoQueryObject.orgId = orgId;

//        var projection = {
//            skip: mongoQuery.skip,
//            limit: mongoQuery.limit,
//            fields: mongoQuery.projection,
//            sort: mongoQuery.sort
//        };

        return this.collection.find(mongoQueryObject, projection)
            .then((docs) => {
                var transformedDocs = [];
                _.forEach(docs, (doc) => {
                    this.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            });
    }

    create(orgId, doc) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to GenericService.create');
        }
        doc.orgId = orgId;
        var valError = this.validate(doc);
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
            throw new Error('Incorrect number of arguments passed to GenericService.updateById');
        }
        if (!this.isValidObjectId(id)) {
            throw new TypeError('id is not a valid ObjectId');
        }
        let clone = _.clone(updatedDoc);
        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
        conversionService.convertISOStringDateTimesToMongoDates(clone);

        let queryObject = { _id: id, orgId: orgId };
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

    update(orgId, mongoQueryObject, updatedDoc) {
        if (arguments.length !== 3) {
            throw new Error('Incorrect number of arguments passed to GenericService.update');
        }
        var clone = _.clone(updatedDoc);
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
//            throw new Error('Incorrect number of arguments passed to GenericService.updateBatch');
//        }
//        var clone = _.clone(updatedDoc);
//        delete clone.id;
//
//        conversionService.convertISOStringDateTimesToMongoDates(clone);
//
//        mongoQueryObject.orgId = orgId;
//        return this.collection.update(mongoQueryObject, {$set: clone});
//    }

    delete(orgId, id) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to GenericService.delete');
        }
        if (!this.isValidObjectId(id)) {
            throw new TypeError('id is not a valid ObjectId');
        }

        let queryObject = { _id: id, orgId: orgId };
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
        return id.match(/^[0-9a-fA-F]{24}$/);
    }


    onBeforeCreate(orgId, result) { return Promise.resolve(result); }
    onBeforeUpdate(orgId, result) { return Promise.resolve(result); }
    onBeforeDelete(orgId, result) { return Promise.resolve(result); }
    onAfterCreate(orgId, result) { return Promise.resolve(result); }
    onAfterUpdate(orgId, result) { return Promise.resolve(result); }
    onAfterDelete(orgId, result) { return Promise.resolve(result); }
}

module.exports = GenericService;