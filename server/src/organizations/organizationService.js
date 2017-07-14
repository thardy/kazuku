"use strict";
const _ = require("lodash");
const GenericService = require("../common/genericService");
const Promise = require('bluebird');
const conversionService = require("../common/conversionService");
const config = require('../server/config');

class OrganizationService extends GenericService {
    constructor(database) {
        super(database, 'organizations');
    }

    getById(id) {
        if (arguments.length !== 1) {
            return Promise.reject(new Error('Incorrect number of arguments passed to OrganizationService.getById'));
        }
        return this.collection.findOne({_id: id})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    getByName(name) {
        return this.collection.findOne({name: name})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    getByCode(code) {
        return this.collection.findOne({code: code})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    validate(doc) {
        let valid = false;
        if (doc.name && doc.code) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return 'Need name and code to create organization';
        }
    }

}


module.exports = OrganizationService;
