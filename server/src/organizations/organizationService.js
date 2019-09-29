"use strict";
const _ = require("lodash");
const GenericService = require("../common/genericService");
const Promise = require('bluebird');
const conversionService = require("../common/conversionService");
const config = require('../server/config');
//let cache = require('memory-cache');

class OrganizationService extends GenericService {
    constructor(database) {
        // I can't imagine a scenario where I would have different databases used in the same app instance for a service, so
        //  using the first one created should be fine to get singleton functionality
        if (!OrganizationService.instance) {
            super(database, 'organizations');

            // we will cache all orgs here because we use orgs in a lot of low-level code (e.g. every incoming api request!!!)
            this.orgCache = [];
            this.getAll()
                .then((orgs) => {
                    this.orgCache = orgs;
                })
                .catch((error) => {
                    console.log('failed to getAll orgs in OrganizationService constructor');
                });


            OrganizationService.instance = this;
        }

        return OrganizationService.instance;
    }

    getAll() {
        let promise = null;
        if (this.orgCache && this.orgCache.length > 0) {
            promise = Promise.resolve(this.orgCache);
        }
        else {
            promise = this.collection.find({})
                .then((docs) => {
                    let transformedDocs = [];
                    _.forEach(docs, (doc) => {
                        this.useFriendlyId(doc);
                        transformedDocs.push(doc);
                    });

                    return transformedDocs;
                });
        }

        return promise;
    }

    getById(id) {
        let promise = null;
        if (arguments.length !== 1) {
            promise = Promise.reject(new Error('Incorrect number of arguments passed to OrganizationService.getById'));
        }
        else if (!this.isValidObjectId(id)) {
            promise = Promise.reject(new TypeError('id is not a valid ObjectId'));
        }
        else {
            if (this.orgCache && this.orgCache.length > 0) {
                promise = Promise.resolve(_.find(this.orgCache, {id: id}));
            }
            else {
                promise = this.collection.findOne({_id: id})
                    .then((doc) => {
                        this.useFriendlyId(doc);
                        return doc;
                    });
            }
        }

        return promise;
    }

    getByName(name) {
        let promise = null;
        if (this.orgCache && this.orgCache.length > 0) {
            promise = Promise.resolve(_.find(this.orgCache, {name: name}));
        }
        else {
            promise = this.collection.findOne({name: name})
                .then((doc) => {
                    this.useFriendlyId(doc);
                    return doc;
                });
        }

        return promise;
    }

    getByCode(code) {
        let promise = null;
        if (this.orgCache && this.orgCache.length > 0) {
            promise = Promise.resolve(_.find(this.orgCache, {code: code}));
        }
        else {
            promise = this.collection.findOne({code: code})
                .then((doc) => {
                    this.useFriendlyId(doc);
                    return doc;
                });
        }

        return promise;
    }

    findOne(mongoQueryObject, projection) {
        let promise = null;

        if (arguments.length < 1) { // need at least the queryObject
            promise = Promise.reject(new Error('Incorrect number of arguments passed to OrganizationService.findOne'));
        }
        else {
            if (this.orgCache && this.orgCache.length > 0) {
                promise = Promise.resolve(_.find(this.orgCache, mongoQueryObject));
            }
            else {
                promise = this.collection.findOne(mongoQueryObject, projection)
                    .then((doc) => {
                        this.useFriendlyId(doc);
                        return doc;
                    });
            }
        }

        return promise;
    }

    create(doc) {
        if (arguments.length !== 1) {
            return Promise.reject(new Error('Incorrect number of arguments passed to OrganizationService.create'));
        }

        let valError = this.validate(doc);
        if (valError) {
            return Promise.reject(new TypeError(valError));
        }

        conversionService.convertISOStringDateTimesToMongoDates(doc);

        return this.onBeforeCreate(null, doc)
            .then((result) => {
                this.orgCache.push(doc);
                return this.collection.insert(doc)
            })
            .then((doc) => {
                this.useFriendlyId(doc);
                return this.onAfterCreate(null, doc)
                    .then(() => { return doc }); // ignore the result of onAfter and return what the original call returned
            });
    }

    updateById(id, updatedDoc) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error('Incorrect number of arguments passed to OrganizationService.updateById'));
        }
        if (!this.isValidObjectId(id)) {
            return Promise.reject(new TypeError('id is not a valid ObjectId'));
        }
        let clone = _.clone(updatedDoc);
        delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
        conversionService.convertISOStringDateTimesToMongoDates(clone);

        let queryObject = { _id: id };
        // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
        return this.onBeforeUpdate(null, clone)
            .then((result) => {
                const cachedItem = _.find(this.orgCache, queryObject);
                _.assign(cachedItem, updatedDoc);

                return this.collection.update(queryObject, {$set: clone})
            })
            .then((result) => {
                return this.onAfterUpdate(null, clone)
                    .then(() => { return result }); // ignore the result of onAfter and return what the original call returned
            });
    }

    delete(id) {
        if (arguments.length !== 1) {
            return Promise.reject(new Error('Incorrect number of arguments passed to OrganizationService.delete'));
        }
        if (!this.isValidObjectId(id)) {
            return Promise.reject(new TypeError('id is not a valid ObjectId'));
        }

        let queryObject = { _id: id };
        return this.onBeforeDelete(null, queryObject)
            .then((result) => {
                _.remove(this.orgCache, (org) => org._id === id);

                return this.collection.remove(queryObject)
            })
            .then((result) => {
                return this.onAfterDelete(null, queryObject)
                    .then(() => { return result }); // ignore the result of onAfter and return what the original call returned
            });
    }

    async getAuthTokenByRepoCode(orgId) {
        const org = await this.getById(orgId);
        return org ? org.authToken : null;
    }

    // until we implement repos, we are using orgCode
    async validateRepoAuthToken(orgCode, authToken) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error('Incorrect number of arguments passed to SiteService.validateSiteAuthToken'));
        }
        const org = await this.findOne({ code: orgCode });

        return org.authToken === authToken;
    }

    validate(doc) {
        let valid = false;
        if (doc.name && doc.code) {
            // don't call base because this is the one doc that does not need an orgId to create
            return;
        }
        else {
            return 'Need name and code to create organization';
        }
    }

}


module.exports = OrganizationService;
