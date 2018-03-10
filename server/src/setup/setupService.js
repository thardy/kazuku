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
        let valError = this.validate(setupConfig);
        if (valError) {
            return Promise.reject(new TypeError(valError));
        }

        // todo: extract metaOrg from setupConfig
        let metaOrg = this.extractMetaOrg(setupConfig);
        let adminUser = this.extractAdminUser(setupConfig);

        return this.organizationService.create(metaOrg)
            .then((org) => {
                return this.userService.create(org.id, adminUser);
            });
        // todo: create initial publish schedule
    }

    extractMetaOrg(setupConfig) {
        let metaOrg = {};
        metaOrg.name = setupConfig.metaOrgName;
        metaOrg.code = setupConfig.metaOrgCode;
        metaOrg.isMetaOrg = true;

        return metaOrg;
    }

    extractAdminUser(setupConfig) {
        let adminUser = {};
        adminUser.email = 'admin';
        adminUser.password = setupConfig.adminPassword;

        return adminUser;
    }

    validate(doc) {
        if (doc.adminPassword && doc.metaOrgCode && doc.metaOrgName) {
            // simply do nothing if valid
            return;
        }
        else {
            return "Need admin password, meta org code, and meta org name";
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
