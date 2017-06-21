"use strict";
const _ = require("lodash");
const Promise = require("bluebird");
const GenericService = require("../common/genericService");
const CustomDataService = require("../customData/customDataService");
const DependencyService = require("../dependencies/dependencyService");
const cache = require("memory-cache");
const Query = require('./query.model');
const ObjectID = require('mongodb').ObjectID;

class QueryService extends GenericService {
    constructor() {
        super(Query);
        this._customDataService = new CustomDataService();
        this._dependencyService = new DependencyService();
        this._orgId = '5949fdeff8e794bdbbfd3d85'; // todo: alter to use auth mechanism (currently logged in user's orgId)
    }

    get customDataService() { return this._customDataService; }
    get dependencyService() { return this._dependencyService; }

    getRegenerateList(orgId) {
        return this.Model.find({orgId: orgId.toString(), regenerate: 1}).lean()
            .then((docs) => {
                var transformedDocs = [];
                _.forEach(docs, (doc) => {
                    this.useFriendlyId(doc);
                    transformedDocs.push(doc);
                });

                return transformedDocs;
            });
    }

    // item should be of format - { type: "data", name: "someQuery" }
    getAllDependentsOfItem(item) {
        // Get all queries that have the given item in their dependencies array.  dependency properties on queries
        // look like this - { dependencies: [{type: 'query', name: 'someQuery' }] }
        return this.Model.find({orgId: this._orgId.toString(), dependencies: item }).lean()
            .then((docs) => {
                var dependentItems = [];
                _.forEach(docs, (doc) => {
                    dependentItems.push({type: "query", name: doc.name});
                });

                return dependentItems;
            })
            .catch(e => {
                throw e;
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
                    .catch(error => {
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
        return this.Model.findOne({orgId: orgId.toString(), name: name}).lean()
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

    getDependenciesOfQuery(query) {
        let dependencies;
        let item;

        // check to see if this value is actually a valid query
        let queryName = this.getNameOfNamedQuery(query);
        if (queryName) {
            item = { type: "query", name: queryName };
        }
        else {
            let contentType = this.getContentType(query);
            if (contentType) {
                item = { type: "data", name: contentType };
            }
        }

        if (item !== undefined) {
            dependencies = [];
            dependencies.push(item);
        }

        return dependencies;
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

    onBeforeCreate(orgId, queryObject) {
        // add/overwrite dependencies property
        queryObject["dependencies"] = this.getDependenciesOfQuery(queryObject.query);
        return Promise.resolve(queryObject);
    }

    onBeforeUpdate(orgId, queryObject) {
        // add/overwrite dependencies property
        queryObject["dependencies"] = this.getDependenciesOfQuery(queryObject.query);
        return Promise.resolve(queryObject);
    }

    onAfterCreate(orgId, queryObject) {
        return Promise.resolve(queryObject);
    }
    onAfterUpdate(orgId, queryObject) {
        // An item changes - recursively get everything dependent on the item that changed
        return this.dependencyService.getAllDependentsOfItem(orgId, {type: 'query', name: queryObject.name })
            .then((dependentObjects) => {
                return this.dependencyService.flagDependentItemsForRegeneration(orgId, dependentObjects);
            });
    }

}

module.exports = QueryService;
