'use strict';
import _ from 'lodash';
import Promise from 'bluebird';
import config from '../server/config/index.js';
import {database} from '../database/database.js';
import OrganizationService from '../organizations/organizationService.js';
import AuthService from '../auth/authService.js';

class SetupService {

    constructor(database) {
        this.organizationService = new OrganizationService(database);
        this.authService = new AuthService(database);
    }

    initialSetup(setupConfig, deviceId) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error('Incorrect number of arguments passed to SetupService.initialSetup'));
        }
        let valError = this.validate(setupConfig);
        if (valError) {
            return Promise.reject(new TypeError(valError));
        }

        // todo: extract metaOrg from setupConfig
        let metaOrg = this.extractMetaOrg(setupConfig);
        let adminUser = this.extractAdminUser(setupConfig);
        let org = null;
        let user = null;

        return this.organizationService.create(metaOrg)
            .then((createdOrg) => {
                org = createdOrg;
                return this.authService.createUser(createdOrg.id, adminUser);
            })
            .then((createdUser) => {
                let newTokensPromise = Promise.resolve(null);
                if (createdUser) {
                    user = createdUser;
                    const refreshTokenExpiresOn = this.authService.getExpiresOnFromDays(config.refreshTokenExpirationInDays);
                    newTokensPromise = this.authService.createNewTokens(createdUser.id, deviceId, refreshTokenExpiresOn);
                }
                // todo: handle failure workflow (not sure what to do atm)
                return newTokensPromise;
            })
            .then((tokenResponse) => {
                const loginResponse = this.authService.getLoginResponse(tokenResponse, user, org);
                return loginResponse;
            });
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
        adminUser.isMetaAdmin = true;

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

export default SetupService;
