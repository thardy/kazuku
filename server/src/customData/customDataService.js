"use strict";
import _ from 'lodash';
var util = require("util");
var GenericService = require("../common/genericService");
var DependencyService = require("../dependencies/dependencyService");
var mongoRql = require('mongo-rql');
//var Query = require('rql/query').Query;

class CustomDataService extends GenericService {
    constructor(database) {
        super(database, 'customData');
        this.dependencyService = new DependencyService(database);
    }

    getByContentType(orgId, contentType) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error('Incorrect number of arguments passed to CustomDataService.getByContentType'));
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
            return Promise.reject(new Error('Incorrect number of arguments passed to CustomDataService.getByTypeAndId'));
        }
        if (!this.isValidObjectId(id)) {
            return Promise.reject(new TypeError('id is not a valid ObjectId'));
        }

        return this.collection.findOne({_id: id, orgId: orgId, contentType: contentType})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    find(orgId, query) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error('Incorrect number of arguments passed to CustomDataService.find'));
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

    deleteByTypeAndId(orgId, contentType, id) {
        if (arguments.length !== 3) {
            return Promise.reject(new Error('Incorrect number of arguments passed to CustomDataService.deleteByTypeAndId'));
        }
        if (!this.isValidObjectId(id)) {
            return Promise.reject(new TypeError('id is not a valid ObjectId'));
        }

        let customDataObject = {_id: id, orgId: orgId, contentType: contentType};

        return this.onBeforeDelete(orgId, customDataObject)
            .then((result) => {
                return this.collection.remove(customDataObject)
            })
            .then((result) => {
                this.onAfterDelete(orgId, customDataObject);
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
        return this.dependencyService.getAllDependentsOfItem(orgId, {type: 'data', nameId: customDataObject.contentType })
            .then((dependentObjects) => {
                return this.dependencyService.flagDependentItemsForRegeneration(orgId, dependentObjects);
            });
    }

    onAfterUpdate(orgId, customDataObject) {
        // An item changes - recursively get everything dependent on the contentType that changed
        return this.dependencyService.getAllDependentsOfItem(orgId, {type: 'data', nameId: customDataObject.contentType })
            .then((dependentObjects) => {
                return this.dependencyService.flagDependentItemsForRegeneration(orgId, dependentObjects);
            });
    }

    onAfterDelete(orgId, customDataObject) {
        // An item changes - recursively get everything dependent on the contentType that changed
        return this.dependencyService.getAllDependentsOfItem(orgId, {type: 'data', nameId: customDataObject.contentType })
            .then((dependentObjects) => {
                return this.dependencyService.flagDependentItemsForRegeneration(orgId, dependentObjects);
            });
    }

}

module.exports = CustomDataService;

