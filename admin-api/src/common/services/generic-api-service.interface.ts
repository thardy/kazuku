import {IUserContext} from '../models/user-context.interface';
import {IMultiTenantEntity} from '@common/models/multi-tenant-entity.interface';
import {DeleteResult} from 'mongodb';

export interface IGenericApiService<T extends IMultiTenantEntity> {
  getAll(userContext: IUserContext): Promise<T[]>;
  getById(userContext: IUserContext, id: string): Promise<T>;
  create(userContext: IUserContext, item: T): Promise<T>;
  updateById(userContext: IUserContext, id: string, item: T): Promise<T>;
  deleteById(userContext: IUserContext, id: string): Promise<DeleteResult>;
}
