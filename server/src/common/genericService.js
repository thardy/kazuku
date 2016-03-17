'use strict';
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

        return this.collection.insert(doc)
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    updateById(orgId, id, updatedDoc) {
        if (arguments.length !== 3) {
            throw new Error('Incorrect number of arguments passed to GenericService.updateById');
        }
        var clone = _.clone(updatedDoc);
        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
        conversionService.convertISOStringDateTimesToMongoDates(clone);

        var queryObject = { _id: id, orgId: orgId };
        // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
        return this.collection.update(queryObject, {$set: clone});
    }

    update(orgId, queryObject, updatedDoc) {
        if (arguments.length !== 3) {
            throw new Error('Incorrect number of arguments passed to GenericService.update');
        }
        var clone = _.clone(updatedDoc);
        delete clone.id;

        conversionService.convertISOStringDateTimesToMongoDates(clone);

        queryObject.orgId = orgId;
        return this.collection.update(queryObject, {$set: clone});
    }

    delete(orgId, id) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to GenericService.delete');
        }
        return this.collection.remove({ _id: id, orgId: orgId });
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
}

module.exports = GenericService;