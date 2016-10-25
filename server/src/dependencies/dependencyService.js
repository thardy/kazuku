"use strict";
var _ = require("lodash");
var Promise = require("bluebird");
var database = require("../database/database");
var QueryService = require("../queries/queryService");

class DependencyService {

    constructor(customDataService, templateService, queryService) {
        this._customDataService = customDataService;
        this._templateService = templateService;
        this._queryService = (queryService) ? queryService : new QueryService(database);
    }

    get customDataService() { return this._customDataService; }
    get templateService() { return this._templateService; }
    get queryService() { return this._queryService; }

    getRegenerationListForItem(item) {
        // Expect simple type objects - e.g. { type: "data", name: "products" }
        let regenerationList = this.getAllDependentsOfItem(item);

        return regenerationList;
    }

    // returns array of dependents, e.g. [{type:"query", name:"top5Products"}, {type:"template", name:"master"}]
    getAllDependentsOfItem(item) {
        // Look for any queries or templates that are dependent on this item (dependencies array contains item)
        let queryDependents = this.queryService.getAllDependentsOfItem(item);
        let templateDependents = this.templateService.getAllDependentsOfItem(item);
        let allDependents = _.union(queryDependents, templateDependents);
        let allSubDependents = [];

        // Recursively do the above for every item in the list
        if (allDependents) {
            for (let dependent of allDependents) {
                let subDependents = this.getAllDependentsOfItem(dependent);
                if (subDependents) {
                    allSubDependents = _.union(allSubDependents, subDependents);
                }
            }

            allDependents = _.union(allDependents, allSubDependents);
        }

        return allDependents;
    }

    getDependenciesOfItem(itemObject) {
        // Expect templateObject or queryObject
        // Determine if itemObject is template or query
        let itemType = this.getTypeOfItem(itemObject);
        let dependencies = [];

        // todo: add itemType "data" - both queries and templates can be dependent on data, and add tests for data dependencies
        switch (itemType) {
            case "page":
            case "template":
                dependencies = this.templateService.getDependenciesOfTemplate(itemObject);
                break;
            case "query":
                // just check the query string itself, not the whole queryObject
                dependencies = this.queryService.getDependenciesOfQuery(itemObject.query);
                break;
        }

        return dependencies;
    }

    getTypeOfItem(item) {
        let typeOfItem = '';

        if ("url" in item) {
            typeOfItem = "page";
        }
        else if ("template" in item) {
            typeOfItem = "template";
        }
        else if ("query" in item) {
            typeOfItem = "query";
        }

        return typeOfItem;
    }

}

module.exports = DependencyService;
