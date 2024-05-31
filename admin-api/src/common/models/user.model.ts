import { ObjectId } from 'mongodb';
import Joi from 'joi';
import {IAuditable} from '@common/models/auditable.interface';
import {IMultiTenantEntity} from '@common/models/multi-tenant-entity.interface';

export class IUser implements IAuditable, IMultiTenantEntity {
  //_id?: ObjectId;
  id?: string;
  orgId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  lastLoggedIn?: Date;
  password?: string
  isMetaAdmin?: boolean;
  created?: Date;
  createdBy?: string;
  updated?: Date;
  updatedBy?: string;
}

export class User implements IUser {
  //_id?: ObjectId;
  id?: string;
  orgId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  lastLoggedIn?: Date;
  password?: string;
  isMetaAdmin?: boolean;
  created?: Date;
  createdBy?: string;
  updated?: Date;
  updatedBy?: string;

  constructor(options: IUser = {}) {
    //this._id = options._id ?? undefined;
    this.id = options.id ?? undefined;
    this.orgId = options.orgId ?? undefined;
    this.email = options.email ?? undefined;
    this.firstName = options.firstName ?? '';
    this.lastName = options.lastName ?? '';
    this.displayName = options.displayName ?? '';
    this.lastLoggedIn = options.lastLoggedIn ?? undefined;
    this.password = options.password ?? '';
    this.isMetaAdmin = options.isMetaAdmin || false;
  }

  static validationSchema = Joi.object().keys({
    orgId: Joi.string()
      .required(),
    email: Joi.string()
      .email()
      .required()
      .allow('admin'),
    firstName: Joi.string()
      .label('First Name'),
    lastName: Joi.string()
      .label('Last Name'),
    password: Joi.string()
      .trim()
      .required()
      .min(4)
      .max(30),
    isMetaAdmin: Joi.boolean()
  });

}
