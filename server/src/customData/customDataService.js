"use strict";
var _ = require("lodash");
var util = require("util");
var GenericService = require("../common/genericService");
var mongoRql = require('mongo-rql');
var Query = require('rql/query').Query;

class CustomDataService extends GenericService {
    constructor(database) {
        super(database, 'customData');
    }

    getByContentType(orgId, contentType) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to CustomDataService.getByContentType');
        }

        return this.collection.find({orgId: orgId, contentType: contentType})
            .then((docs) => {
                var transformedDocs = [];
                _.forEach(docs, (doc) => {
                    this.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            });
    }

    getByTypeAndId(orgId, contentType, id) {
        if (arguments.length !== 3) {
            throw new Error('Incorrect number of arguments passed to CustomDataService.getByTypeAndId');
        }

        return this.collection.findOne({_id: id, orgId: orgId, contentType: contentType})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    find(orgId, query) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to CustomDataService.find');
        }

        // Hardwire orgId into every query
        if (typeof query === 'string' || query instanceof String) {
            query = 'eq(orgId,' + orgId + ')&' + query;
        }
        else {
            // todo: test that this actually shows up in the query - https://docs.mongodb.org/manual/tutorial/manage-the-database-profiler/
            query = query.eq('orgId', orgId);
        }

        var mongoQuery = mongoRql(query);
        var projection = {
            skip: mongoQuery.skip,
            limit: mongoQuery.limit,
            fields: mongoQuery.projection,
            sort: mongoQuery.sort
        };

        return this.collection.find(mongoQuery.criteria, projection)
            .then((docs) => {
                var transformedDocs = [];
                _.forEach(docs, (doc) => {
                    this.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            });
    }

    // todo: replace updateById with an updateByTypeAndId (pretty sure I'm going to have to turn it into a get then an
    //  update in order to check and enforce the context - something I'll have to do in order to enforce orgId context anyway)
    deleteByTypeAndId(orgId, contentType, id) {
        if (arguments.length !== 3) {
            throw new Error('Incorrect number of arguments passed to CustomDataService.deleteByTypeAndId');
        }

        return this.collection.remove({_id: id, orgId: orgId, contentType: contentType});
    }

    // todo: validate that the contentType exists (customSchema) for this org and implement any schema validation
    validate(doc) {
        if (doc.contentType) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return "Need contentType";
        }
    }
}

module.exports = CustomDataService;

