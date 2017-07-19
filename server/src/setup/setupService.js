'use strict';
const _ = require("lodash");
const Promise = require("bluebird");
const database = require("../database/database").database;
const OrganizationService = require('../organizations/organizationService');
const UserService = require('../users/userService');

class SetupService {

    constructor(database) {
        this.organizationService = new OrganizationService(database);
        this.userService = new UserService(database);
    }

    initialSetup(setupConfig) {
        if (arguments.length !== 1) {
            return Promise.reject(new Error('Incorrect number of arguments passed to SetupService.initialSetup'));
        }
        let valError = this.validate(doc);
        if (valError) {
            return Promise.reject(new TypeError(valError));
        }

        // todo: extract metaOrg from setupConfig
        let metaOrg = this.extractMetaOrg(setupConfig);
        let adminUser = this.extractAdminUser(setupConfig);

        return this.organizationsCollection.insert(metaOrg)
            .then((org) => {
                this.useFriendlyId(org);
                return org;
            })
            .then((org) => {
                return this.usersCollection.insert(adminUser);
            });
    }

    extractMetaOrg(setupConfig) {
        let metaOrg = {};
        metaOrg.name = setupConfig.name;
        metaOrg.code = setupConfig.code;

        return metaOrg;
    }

    extractAdminUser(setupConfig) {
        let adminUser = {};
        adminUser.email = 'admin';
        adminUser.password = setupConfig.password;

        return adminUser;
    }

    validate(doc) {
        if (doc.orgId) {
            // simply do nothing if valid
            return;
        }
        else {
            return "Need orgId";
        }
    }

    useFriendlyId(doc) {
        if (doc && doc._id) {
            doc.id = doc._id.toHexString();
        }
    }

    isValidObjectId(id) {
        return id.match(/^[0-9a-fA-F]{24}$/);
    }


}

module.exports = SetupService;
