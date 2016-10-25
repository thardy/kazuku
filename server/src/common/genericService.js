"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var conversionService = require("./conversionService");

class GenericService {

    constructor(database, collectionName) {
        this._db = database;
        this._collection = database[collectionName];
    }

    get collection() { return this._collection; }
    get db() { return this._db; }

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

        return this.onBeforeCreate(doc)
            .then((result) => {
                return this.collection.insert(doc)
            })
            .then((doc) => {
                this.useFriendlyId(doc);
                this.onAfterCreate(doc); // we don't wait for whatever is done in onAfter
                return doc;
            });
    }

    updateById(orgId, id, updatedDoc) {
        if (arguments.length !== 3) {
            throw new Error('Incorrect number of arguments passed to GenericService.updateById');
        }
        let clone = _.clone(updatedDoc);
        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
        conversionService.convertISOStringDateTimesToMongoDates(clone);

        let queryObject = { _id: id, orgId: orgId };
        // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
        return this.onBeforeUpdate(clone)
            .then((result) => {
                return this.collection.update(queryObject, {$set: clone})
            })
            .then((result) => {
                this.onAfterUpdate(clone); // we don't wait for whatever is done in onAfter
                return result;
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

        return this.onBeforeUpdate(clone)
            .then((result) => {
                return this.collection.update(mongoQueryObject, {$set: clone});
            })
            .then((result) => {
                this.onAfterUpdate(clone); // we don't wait for whatever is done in on After
                return result;
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
        let queryObject = { _id: id, orgId: orgId };
        return this.onBeforeDelete(queryObject)
            .then((result) => {
                return this.collection.remove(queryObject)
            })
            .then((result) => {
                this.onAfterDelete(queryObject);
                return result;
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

    onBeforeCreate(doc) {
        return Promise.resolve();
    }
    onBeforeUpdate(doc) { return Promise.resolve(); }
    onBeforeDelete(doc) { return Promise.resolve(); }
    onAfterCreate(doc) { }
    onAfterUpdate(doc) { }
    onAfterDelete(doc) { }
}

module.exports = GenericService;