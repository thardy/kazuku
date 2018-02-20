'use strict';
var _ = require('lodash');
var util = require('util');
var GenericService = require('../common/genericService');

class CustomSchemaService extends GenericService {
    constructor(database) {
        super(database, 'customSchemas');
    }

    getByContentType(orgId, contentType) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error(
                'Incorrect number of arguments passed to CustomSchemaService.getByContentType'));
        }

        return this.collection.findOne(
            {orgId: orgId, contentType: contentType}).then((doc) => {
            this.useFriendlyId(doc);
            return doc;
        });
    }

    updateByContentType(orgId, contentType, updatedDoc) {
        if (arguments.length !== 3) {
            return Promise.reject(new Error(
                'Incorrect number of arguments passed to CustomSchemaService.updateByContentType'));
        }
        var clone = _.clone(updatedDoc);
        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
        // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
        return this.collection.update({orgId: orgId, contentType: contentType},
            {$set: clone});
    }

    deleteByContentType(orgId, contentType) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error(
                'Incorrect number of arguments passed to CustomSchemaService.deleteByContentType'));
        }
        return this.collection.remove({orgId: orgId, contentType: contentType});
    }

    validate(doc) {
        if (doc.contentType && doc.jsonSchema) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return 'Need contentType and jsonSchema';
        }
    }

}

module.exports = CustomSchemaService;


