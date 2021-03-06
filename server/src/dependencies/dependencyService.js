'use strict';
import _ from 'lodash';
import Promise from 'bluebird';

class DependencyService {

    constructor(database) {
        this._db = database;
    }

    get db() { return this._db; }

    // getRegenerationListForItem(orgId, item) {
    //     // Expect simple type objects - e.g. { type: "data", nameId: "products" }
    //     let regenerationList = this.getAllDependentsOfItem(orgId, item);
    //
    //     return regenerationList;
    // }

    // returns array of dependents in "item" format (nameId is kebab-cased,
    //  e.g. [{type:"query", nameId:"top_5_products"}, {type:"template", nameId:"master"}]
    getAllDependentsOfItem(orgId, item, recurseLevel) {
        // Look for any queries or templates that are dependent on this item (their dependencies array contains item)
        if (!recurseLevel) {
            recurseLevel = 1;
        }
        else {
            recurseLevel += 1;
        }
        let promise = Promise.resolve([]);

        // I'm not looking for query children after the first batch because currently, queries can't depend on other
        //  queries. The first batch should have been all that we care about.
        if (recurseLevel <= 1) {
            promise = this.db.queries.find({orgId: orgId, dependencies: item});
        }
        return promise
            .then((dependentQueries) => {
                // get the dependentTemplates, and pass both those and the dependentQueries as the result - resultsArray
                return Promise.all([dependentQueries, this.db.templates.find({orgId: orgId, dependencies:item})]);
            })
            .then((resultsArray) => {
                // dependentQueries should be index 0, and dependentTemplates index 1
                let currentAllDependents = _.unionWith(resultsArray[0], resultsArray[1], _.isEqual); // unionWith creates a distinct union with no duplicates
                let currentSubDependents = [];
                let promises = [];

                // Recursively do the above for every item in the list
                if (currentAllDependents.length > 0) {
                    for (let dependent of currentAllDependents) {
                        let itemType = this.getTypeOfItem(dependent);
                        let dependentItem = { type: itemType, nameId: dependent.nameId };

                        promises.push(this.getAllDependentsOfItem(orgId, dependentItem, recurseLevel));
                    }
                }

                // todo: test this with promises being empty.  What happens with Promise.all([]); ???  Do I need to convert an empty
                //  array of promises into a self-resolving promise? According to docs, it looks like it should be fine.

                // Calling Promise.all on the array of promises from above because order doesn't matter.  We just
                //  need to know when they are all done.
                return Promise.all(promises)
                    .then((subDependentsResultsArray) => { // array with each item being a result of one of the promises
                        // loop through all the resulting dependent arrays, unioning the dependents together
                        for (let subDependents of subDependentsResultsArray) {
                            if (subDependents) {
                                currentSubDependents = _.unionWith(currentSubDependents, subDependents, _.isEqual);
                            }
                        }

                        // union this distinct list of subDependents with the currentAllDependents above and return it
                        return currentAllDependents = _.unionWith(currentAllDependents, currentSubDependents, _.isEqual);
                    });
            });
    }

    flagDependentItemsForRegeneration(orgId, dependentObjects) {
        let promises = [];

        for (let dependentObject of dependentObjects) {
            let type = this.getTypeOfItem(dependentObject);
            let queryObject = {orgId: orgId, nameId: dependentObject.nameId};
            let changes = {regenerate: 1};

            switch (type) {
                case 'query':
                    promises.push(this.db.queries.update(queryObject, {$set: changes}));
                    break;
                // we only flag pages.  While we need the entire dependency tree to flag all the pages, templates don't
                //  get flagged because a template should only get regenerated within the context of a page.
                case 'page':
                    promises.push(this.db.templates.update(queryObject, {$set: changes}));
                    break;
            }
        }

        return Promise.all(promises);
    }

    // getDependenciesOfItem(itemObject) {
    //     // Expect templateObject or queryObject
    //     // Determine if itemObject is template or query
    //     let itemType = this.getTypeOfItem(itemObject);
    //     let dependencies = [];
    //
    //     // todo: add itemType "data" - both queries and templates can be dependent on data, and add tests for data dependencies
    //     switch (itemType) {
    //         case "page":
    //         case "template":
    //             dependencies = this.templateService.getDependenciesOfTemplate(itemObject);
    //             break;
    //         case "query":
    //             // just check the query string itself, not the whole queryObject
    //             dependencies = this.queryService.getDependenciesOfQuery(itemObject.query);
    //             break;
    //     }
    //
    //     return dependencies;
    // }

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

export default DependencyService;
