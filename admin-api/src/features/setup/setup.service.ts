import {Db} from 'mongodb';
import {IOrganization, IUser, entityUtils} from '@kazuku-cms/common';

import {OrganizationService} from '#features/organizations/organization.service';
import {AuthService} from '#features/auth/auth.service';
import config from '#server/config/config';
import {ISetupConfig, SetupConfig} from '#features/setup/setup-config.model';
import {LoginResponse} from '#common/models/login-response.model';

export class SetupService {
  private orgService: OrganizationService;
  private authService: AuthService;

  constructor(db: Db) {
    // replace all this.organizationService with this.orgService
    this.orgService = OrganizationService.getInstance(db);
    this.authService = new AuthService(db);
  }

  async initialSetup(setupConfig: ISetupConfig, deviceId: string, isTest = false) {
    const validationResult = this.validate(setupConfig);
    entityUtils.handleValidationResult(validationResult, 'SetupService.initialSetup'); // throws on error

    let metaOrg = this.extractMetaOrg(setupConfig);
    let adminUser = this.extractAdminUser(setupConfig, isTest);

    let org = await this.orgService.create(undefined, metaOrg);
    adminUser.orgId = org.id;
    let user = await this.authService.createUser(undefined, adminUser);

    let tokenResponse = undefined;
    if (user) {
      const refreshTokenExpiresOn = this.authService.getExpiresOnFromDays(config.refreshTokenExpirationInDays);
      tokenResponse = await this.authService.createNewTokens(user.id!, deviceId, refreshTokenExpiresOn);
    }

    const loginResponse = new LoginResponse({ tokens: tokenResponse, userContext: { user, org } });
    return loginResponse;
  }

  extractMetaOrg(setupConfig: ISetupConfig, isTest = false) {
    let metaOrg: IOrganization = {};
    metaOrg.code = isTest ? 'admin-test' : 'admin';
    metaOrg.name = setupConfig.metaOrgName;
    metaOrg.isMetaOrg = true;

    return metaOrg;
  }

  extractAdminUser(setupConfig: ISetupConfig, isTest = false) {
    let adminUser: IUser = {};
    adminUser.email = isTest ? 'admin@test.com' : 'admin';
    adminUser.password = setupConfig.adminPassword;
    adminUser.isMetaAdmin = true;

    return adminUser;
  }

  validate(entity: ISetupConfig) {
    return SetupConfig.validationSchema.validate(entity, {abortEarly: false});
  }

  async setupCompleted() {
    const org = await this.orgService.findOne({code: 'admin'});

    // if we found an org with an id for code = 'admin", then setup has been completed
    const setupCompleted = !!(org && org.id);
    return setupCompleted;;
  }
}
