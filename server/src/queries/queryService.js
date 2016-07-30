"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var GenericService = require("../common/genericService");
var CustomDataService = require("../customData/customDataService");

class QueryService extends GenericService {
    constructor(database) {
        super(database, 'queries');
        this._customDataService = new CustomDataService(database);
    }

    get customDataService() { return this._customDataService; }

    getRegenerateList(orgId) {
        return this.collection.find({orgId: orgId, regenerate: 1})
            .then((docs) => {
                var transformedDocs = [];
                _.forEach(docs, (doc) => {
                    this.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            });
    }

    getAllDependentsOfItem(item) {
        return [];
    }

    resolve(orgId, query) {
        // query is an actual query, e.g. eq(contentType,products)&lt(price,20)&sort(created)
        return this.customDataService.find(orgId, query);
    }

    resolveQueryPropertiesOnModel(orgId, model) {
        const promises = [];
        // some local helper functions to make this more clear
        const resolveQueryByName = queryName => this.getByName(orgId, queryName)
                .then((queryObject) => {
                    if (queryObject && queryObject.results) {
                        // queryObject has cached results.  Use them
                        return queryObject.results;
                    }
                    else {
                        // resolve the query
                        return this.resolve(orgId, queryObject.query);
                    }
                })
                .then(null, (error) => {
                    console.log(error);
                });
        const resolveModelProperty = (modelProperty) => {
            const queryName = this.getNameOfNamedQuery(modelProperty);
            if (queryName) {
                return resolveQueryByName(queryName);
            }
            else if (this.propertyIsQuery(modelProperty)) {
                return this.resolve(modelProperty);
            }
            else {
                return Promise.resolve(modelProperty);
            }
        };

        for (let property in model) {
            if (model.hasOwnProperty(property)) {
                promises.push(
                    resolveModelProperty(model[property])
                        .then(result =>
                            model[property] = result
                        )
                );
            }
        }

        return Promise.all(promises)
            .then((result) => {
                console.log("resolveQueryPropertiesOnModel finished");
            });
    }

    getByName(orgId, name) {
        if (arguments.length !== 2) {
            throw new Error('Incorrect number of arguments passed to QueryService.getByName');
        }
        return this.collection.findOne({orgId: orgId, name: name})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }


    getNameOfNamedQuery(query) {
        let queryName;

        // check to see if this value is actually a valid query
        if (query && query.startsWith("query(")) {
            // get the name of the query
            let matchArray = query.match(/query\(([a-zA-Z0-9-_]*)\)/);
            queryName = matchArray[1];
        }

        return queryName;
    }

    propertyIsQuery(modelProperty) {
        return this.getContentType(modelProperty) ? true : false;
    }

    getContentType(query) {
        let contentType;

        if (query.startsWith("eq(")) {
            // currently, this is only smart enough to understand one contentType dependency from a query,
            //  and the query must start with "eq(contentType, "
            // get the contentType
            let matchArray = query.match(/eq\(contentType,([a-zA-Z0-9-_]*)\)/);
            contentType = matchArray[1];
        }

        return contentType;
    }

    validate(doc) {
        if (doc.name && doc.query) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return "Need name and query";
        }
    }

}

module.exports = QueryService;
