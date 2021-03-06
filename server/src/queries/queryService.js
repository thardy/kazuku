'use strict';
import _ from 'lodash';
import Promise from 'bluebird';
import GenericService from '../common/genericService.js';
import CustomDataService from '../customData/customDataService.js';
import DependencyService from '../dependencies/dependencyService.js';
import cache from 'memory-cache';

class QueryService extends GenericService {
    constructor(database) {
        super(database, 'queries');
        this.customDataService = new CustomDataService(database);
        this.dependencyService = new DependencyService(database);
    }

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

    // item should be of format - { type: "data", nameId: "some-query" }
    // todo: I don't think this is used anymore.  Convert anything using this to use dependencyService.getAllDependentsOfItem instead
    getAllDependentsOfItem(orgId, item) {
        // Get all queries that have the given item in their dependencies array.  dependency properties on queries
        // look like this (nameId is kebab-cased) - { dependencies: [{type: 'query', nameId: 'some-query' }] }
        return this.collection.find({orgId: orgId, dependencies: item })
            .then((docs) => {
                var dependentItems = [];
                _.forEach(docs, (doc) => {
                    dependentItems.push({type: "query", nameId: doc.nameId});
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
        const resolveQueryByNameId = (queryNameId) => {
            let cachedResults = cache.get(`query_${queryNameId}`);
            if (cachedResults) {
                return Promise.resolve(cachedResults);
            }
            else {
                return this.getByNameId(orgId, queryNameId)
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
            const queryNameId = this.getNameIdOfNamedQuery(modelProperty);
            if (queryNameId) {
                // property is a named query, e.g. query(top_5_products)
                return resolveQueryByNameId(queryNameId);
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

    getByNameId(orgId, nameId) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error('Incorrect number of arguments passed to QueryService.getByNameId'));
        }
        return this.collection.findOne({orgId: orgId, nameId: nameId})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }


    getNameIdOfNamedQuery(query) {
        let queryNameId;

        // check to see if this value is actually a string and a valid query
        if (query && (typeof query === 'string' || query instanceof String) && query.startsWith("query(")) {
            // get the nameId of the query.  Named queries should be referenced using a nameId in a property like - query(all-blogs)
            let matchArray = query.match(/query\(([a-zA-Z0-9-_]*)\)/);
            queryNameId = matchArray[1];
        }

        return queryNameId;
    }

    propertyIsQuery(modelProperty) {
        return this.getContentType(modelProperty) ? true : false;
    }

    getContentType(query) {
        let contentType;

        if (query && (typeof query === 'string' || query instanceof String) && query.startsWith("eq(")) {
            // currently, this is only smart enough to understand one contentType dependency from a query,
            //  and the query must start with "eq(contentType, "
            // get the contentType.  It should be a kebab-cased nameId as well.
            let matchArray = query.match(/eq\(contentType,([a-zA-Z0-9-_]*)\)/);
            contentType = matchArray[1];
        }

        return contentType;
    }

    getDependenciesOfQuery(query) {
        let dependencies;
        let item;

        // check to see if this value is actually a valid query
        let queryNameId = this.getNameIdOfNamedQuery(query);
        if (queryNameId) {
            item = { type: "query", nameId: queryNameId.toLowerCase() };
        }
        else {
            let contentType = this.getContentType(query);
            if (contentType) {
                item = { type: "data", nameId: contentType.toLowerCase() };
            }
        }

        if (item !== undefined) {
            dependencies = [];
            dependencies.push(item);
        }

        return dependencies;
    }

    validate(doc) {
        if (doc.name && doc.nameId && doc.query) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return "Need name, nameId, and query";
        }
    }

    onBeforeCreate(orgId, queryObject) {
        queryObject['regenerate'] = 1;
        // add/overwrite dependencies property
        queryObject['dependencies'] = this.getDependenciesOfQuery(queryObject.query);
        return super.onBeforeCreate(orgId, queryObject);
    }

    onBeforeUpdate(orgId, queryObject) {
        queryObject['regenerate'] = 1;
        // add/overwrite dependencies property
        queryObject['dependencies'] = this.getDependenciesOfQuery(queryObject.query);
        return super.onBeforeUpdate(orgId, queryObject);
    }

    onAfterCreate(orgId, queryObject) {
        return super.onAfterCreate(orgId, queryObject);
    }
    onAfterUpdate(orgId, queryObject) {
        // An item changes - recursively get everything dependent on the item that changed
        return this.dependencyService.getAllDependentsOfItem(orgId, {type: 'query', nameId: queryObject.nameId })
            .then((dependentObjects) => {
                return this.dependencyService.flagDependentItemsForRegeneration(orgId, dependentObjects);
            })
            .then((result) => {
                return super.onAfterUpdate(orgId, result);
            });
    }

}

export default QueryService;
