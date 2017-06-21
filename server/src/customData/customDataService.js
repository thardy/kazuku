"use strict";
const _ = require("lodash");
const util = require("util");
const GenericService = require("../common/genericService");
const DependencyService = require("../dependencies/dependencyService");
const mongoRql = require('mongo-rql');
const CustomData = require('./customData.model');
//var Query = require('rql/query').Query;

class CustomDataService extends GenericService {
    constructor() {
        super(CustomData);
        this._dependencyService = new DependencyService();
    }

    get dependencyService() { return this._dependencyService; }

    getByContentType(orgId, contentType) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to CustomDataService.getByContentType');
        }

        return this.Model.find({orgId: orgId.toString(), contentType: contentType}).lean()
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

        return this.Model.findOne({_id: id.toString(), orgId: orgId.toString(), contentType: contentType}).lean()
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
            query = 'eq(orgId,' + orgId.toString() + ')&' + query;
        }
        else {
            // todo: test that this actually shows up in the query - https://docs.mongodb.org/manual/tutorial/manage-the-database-profiler/
            query = query.eq('orgId', orgId.toString());
        }

        var mongoQuery = mongoRql(query);
        var projection = {
            skip: mongoQuery.skip,
            limit: mongoQuery.limit
        };
        if (mongoQuery.fields) {
            projection.fields = mongoQuery.projection;
        }
        if (mongoQuery.sort) {
            projection.sort = mongoQuery.sort;
        }

        return this.Model.find(mongoQuery.criteria, projection).lean()
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

        let queryObject = {_id: id.toString(), orgId: orgId.toString(), contentType: contentType};

        return this.onBeforeDelete(queryObject)
            .then((result) => {
                return this.Model.remove(queryObject)
            })
            .then((result) => {
                this.onAfterDelete(queryObject);
                return result;
            });
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

    onAfterCreate(orgId, customDataObject) {
        // An item is created - recursively get everything dependent on the contentType that changed
        return this.dependencyService.getAllDependentsOfItem(orgId, {type: 'data', name: customDataObject.contentType })
            .then((dependentObjects) => {
                return this.dependencyService.flagDependentItemsForRegeneration(orgId, dependentObjects);
            });
    }

    onAfterUpdate(orgId, customDataObject) {
        // An item changes - recursively get everything dependent on the contentType that changed
        return this.dependencyService.getAllDependentsOfItem(orgId, {type: 'data', name: customDataObject.contentType })
            .then((dependentObjects) => {
                return this.dependencyService.flagDependentItemsForRegeneration(orgId, dependentObjects);
            });
    }

    onAfterDelete(orgId, customDataObject) {
        // An item changes - recursively get everything dependent on the contentType that changed
        return this.dependencyService.getAllDependentsOfItem(orgId, {type: 'data', name: customDataObject.contentType })
            .then((dependentObjects) => {
                return this.dependencyService.flagDependentItemsForRegeneration(orgId, dependentObjects);
            });
    }

}

module.exports = CustomDataService;

