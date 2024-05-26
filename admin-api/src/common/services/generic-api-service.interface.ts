import {IUserContext} from '../models/user-context.interface';
import {IMultiTenantEntity} from '@common/models/multi-tenant-entity.interface';
import {DeleteResult, Document, UpdateResult} from 'mongodb';

export interface IGenericApiService<T extends IMultiTenantEntity> {
  getAll(userContext: IUserContext): Promise<T[]>;
  getById(userContext: IUserContext, id: string): Promise<T>;
  create(userContext: IUserContext, item: T): Promise<T>;
  updateById(userContext: IUserContext, id: string, item: T): Promise<any>;
  updateByIdWithoutBeforeAndAfter(userContext: IUserContext, id: string, item: T): Promise<any>;
  update(userContext: IUserContext, queryObject: any, item: T): Promise<any>;
  deleteById(userContext: IUserContext, id: string): Promise<DeleteResult>;
}
