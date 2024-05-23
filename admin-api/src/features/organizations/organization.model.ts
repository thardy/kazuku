import { ObjectId } from 'mongodb';
import Joi from 'joi';
import {IAuditable} from '@common/models/auditable.interface';

export class IOrganization implements IAuditable {
  //_id?: ObjectId;
  id?: string;
  name?: string;
  code?: string;
  description?: string;
  statusId?: number;
  isMetaOrg?: boolean;
  created?: Date;
  createdBy?: string;
  updated?: Date;
  updatedBy?: string;
}

export class Organization implements IOrganization {
  //_id?: ObjectId;
  id?: string;
  name?: string;
  code?: string;
  description?: string;
  statusId?: number;
  isMetaOrg?: boolean;
  created?: Date;
  createdBy?: string;
  updated?: Date;
  updatedBy?: string;

  constructor(options: IOrganization = {}) {
    //this._id = options._id ?? undefined;
    this.id = options.id ?? undefined;
    this.name = options.name ?? undefined;
    this.code = options.code ?? undefined;
    this.description = options.description ?? undefined;
    this.statusId = options.statusId ?? 1;
    this.isMetaOrg = options.isMetaOrg ?? false;
  }

  static validationSchema = Joi.object().keys({
    id: Joi.string(),
    name: Joi.string()
      .required(),
    code: Joi.string()
      .required(),
    description: Joi.string(),
    statusId: Joi.number(), // todo: add a reference to all possible statusIds
    isMetaOrg: Joi.boolean()
  });

}
