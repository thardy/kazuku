"use strict";
var _ = require("lodash");
var Promise = require("bluebird");

const systemProperties = ["_id", "id", "orgId", "siteId", "name", "url", "layout", "template", "created", "createdBy", "updated", "updatedBy", "dependencies", "regenerate"];

class DependencyService {

    constructor(customDataService, templateService, queryService) {
        this._customDataService = customDataService;
        this._templateService = templateService;
        this._queryService = queryService;
    }

    get customDataService() { return this._customDataService; }
    get templateService() { return this._templateService; }
    get queryService() { return this._queryService; }

    getRegenerationListForItem(item) {
        // Expect simple type objects - e.g. { type: "data", name: "products" }
        let regenerationList = this.getAllDependentsOfItem(item);

        return regenerationList;
    }

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

        switch (itemType) {
            case "page":
            case "template":
                dependencies = this.getDependenciesOfTemplate(itemObject);
                break;
            case "query":
                // just check the query string itself, not the whole queryObject
                dependencies = this.getDependenciesOfQuery(itemObject.query);
                break;
        }

        return dependencies;
    }

    getDependenciesOfTemplate(template) {
        let dependencies = [];

        // a layout is a dependency
        if ("layout" in template) {
            dependencies.push({type: "template", name: template.layout})
        }

        // any queries defined in the model are dependencies
        // look at all properties on the templateObject that aren't system properties to see if they are queries
        for (let property in template) {
            if (template.hasOwnProperty(property) && !systemProperties.contains(property)) {
                let queryDependencies = this.getDependenciesOfQuery(template[property]);
                if (queryDependencies !== undefined) {
                    dependencies = dependencies.concat(queryDependencies);
                }
            }
        }

        // any includes in the template are dependencies
        let includedTemplateDependencies = this.getIncludedTemplateDependencies(template.template);
        if (includedTemplateDependencies !== undefined) {
            dependencies = dependencies.concat(includedTemplateDependencies);
        }

        return dependencies;
    }

    getDependenciesOfQuery(query) {
        let dependencies = undefined;
        let item = undefined;

        // check to see if this value is actually a valid query
        if (query.startsWith("query(")) {
            // get the name of the query
            let matchArray = query.match(/query\(([a-zA-Z0-9-_]*)\)/);
            let queryName = matchArray[1];
            item = { type: "query", name: queryName };
        }
        else if (query.startsWith("eq(")) {
            // currently, this is only smart enough to understand one contentType dependency from a query
            // get the contentType
            let matchArray = query.match(/eq\(contentType, ([a-zA-Z0-9-_]*)\)/);
            let contentType = matchArray[1];
            item = { type: "data", name: contentType };
        }

        if (item !== undefined) {
            dependencies = [];
            dependencies.push(item);
        }

        return dependencies;
    }

    getIncludedTemplateDependencies(templateString) {
        let includedTemplateDependencies = [];

        // We are looking for the following strings - {% include header %}, to pull out the name inside the include
        templateString.replace(/{%\s?include ([a-zA-Z0-9-_]*)[ %]/g, (match, group1) => {
            includedTemplateDependencies.push({ type: "template", name: group1 });
        });

        return includedTemplateDependencies;
    };

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
