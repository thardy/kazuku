import Joi from 'joi';

export interface ISetupConfig {
  adminPassword: string;
  adminPasswordConfirm: string;
  metaOrgName: string;
}

export class SetupConfig {
  adminPassword: string;
  adminPasswordConfirm: string;
  metaOrgName: string;

  constructor(options: ISetupConfig) {
    this.adminPassword = options.adminPassword ?? '';
    this.adminPasswordConfirm = options.adminPasswordConfirm ?? '';
    this.metaOrgName = options.metaOrgName ?? '';
  }

  static validationSchema = Joi.object().keys({
    adminPassword: Joi.string()
      .required(),
    adminPasswordConfirm: Joi.string(),
    metaOrgName: Joi.string()
      .required(),
  });
}
