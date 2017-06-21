"use strict";
const _ = require("lodash");
const util = require("util");
const GenericService = require("../common/genericService");
const CustomSchema = require('./customSchema.model');

class CustomSchemaService extends GenericService {
    constructor() {
        super(CustomSchema);
    }

    getByContentType(orgId, contentType) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to CustomSchemaService.getByContentType');
        }

        return this.Model.findOne({orgId: orgId, contentType: contentType}).lean()
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    updateByContentType(orgId, contentType, updatedDoc) {
        if (arguments.length !== 3) {
            throw new Error('Incorrect number of arguments passed to CustomSchemaService.updateByContentType');
        }
        var clone = _.clone(updatedDoc);
        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
        // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
        return this.Model.update({orgId: orgId, contentType: contentType}, {$set: clone});
    }

    deleteByContentType(orgId, contentType) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to CustomSchemaService.deleteByContentType');
        }
        return this.Model.remove({orgId: orgId, contentType: contentType});
    }

    validate(doc) {
        if (doc.contentType && doc.jsonSchema) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return "Need contentType and jsonSchema";
        }
    }

}

module.exports = CustomSchemaService;


