import Joi from 'joi';
import {IAuditable} from '@kazuku-cms/common';

export class ISite implements IAuditable {
  id?: string;
  orgId?: string;
  code?: string;
  name?: string;
  domainName?: string;
  description?: string;
  created?: Date;
  createdBy?: string;
  updated?: Date;
  updatedBy?: string;
}

export class Site implements ISite {
  id?: string;
  orgId: string;
  code?: string;
  name?: string;
  domainName?: string;
  description?: string;
  created?: Date;
  createdBy?: string;
  updated?: Date;
  updatedBy?: string;

  constructor(options: ISite = {}) {
    this.id = options.id ?? undefined;
    this.orgId = options.orgId ?? '';
    this.code = options.code ?? '';
    this.name = options.name ?? '';
    this.domainName = options.domainName ?? '';
    this.description = options.description ?? '';
  }

  // Think of validation almost exclusively within the context of the user giving us
  //  an entity to create. We will programmatically enforce orgId and auto-add audit props.
  static validationSchema = Joi.object().keys({
    orgId: Joi.string(),
    code: Joi.string()
      .required(),
    name: Joi.string()
      .required(),
    domainName: Joi.string(),
    description: Joi.string(),
  });

}
