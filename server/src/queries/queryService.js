"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var GenericService = require("../common/genericService");
var CustomDataService = require("../customData/customDataService");
var cache = require("memory-cache");

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
        // Get all queries that have the given item in their dependencies array.  dependency properties on queries
        // look like this - { dependencies: [{type: 'query', name: 'master' }] }
        return this.collection.find(this.orgId, { dependencies: item })
            .then((docs) => {
                var transformedDocs = [];
                _.forEach(docs, (doc) => {
                    this.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            })
            .then(null, (error) => { // todo: replace with catch once I fix the promises coming back from Monk.
                throw error;
            });
    }

    resolve(orgId, query) {
        // query is an actual query, e.g. eq(contentType,products)&lt(price,20)&sort(created)
        return this.customDataService.find(orgId, query);
    }

    resolveQueryPropertiesOnModel(orgId, model) {
        const promises = [];
        // some local helper functions to make this more clear
        const resolveQueryByName = (queryName) => {
            let cachedResults = cache.get(queryName);
            if (cachedResults) {
                return Promise.resolve(cachedResults);
            }
            else {
                return this.getByName(orgId, queryName)
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
            }
        };
        const resolveModelProperty = (modelProperty) => {
            const queryName = this.getNameOfNamedQuery(modelProperty);
            if (queryName) {
                // property is a named query, e.g. query(top5Products)
                return resolveQueryByName(queryName);
            }
            else if (this.propertyIsQuery(modelProperty)) {
                // property is an actual query e.g. eq(contentType,products)&gt(price,9.99)&limit(10,0)
                return this.resolve(modelProperty);
            }
            else {
                return Promise.resolve(modelProperty);
            }
        };


        // Loop through our model properties to resolve queries, using the above helper functions
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
                // we don't need to return the result because we modified all the model properties directly with the results
                //console.log("resolveQueryPropertiesOnModel finished");
                return '';
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

        // check to see if this value is actually a string and a valid query
        if (query && (typeof query === 'string' || query instanceof String) && query.startsWith("query(")) {
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

        if (query && (typeof query === 'string' || query instanceof String) && query.startsWith("eq(")) {
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
