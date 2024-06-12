import {IUserContext, IMultiTenantEntity} from '@kazuku-cms/common';
import {DeleteResult, Document, FindOptions, UpdateResult} from 'mongodb';

export interface IGenericApiService<T extends IMultiTenantEntity> {
  getAll(userContext: IUserContext): Promise<T[]>;
  getById(userContext: IUserContext, id: string): Promise<T>;
  create(userContext: IUserContext, item: T): Promise<T>;
  updateById(userContext: IUserContext, id: string, item: T): Promise<any>;
  updateByIdWithoutBeforeAndAfter(userContext: IUserContext, id: string, item: T): Promise<any>;
  update(userContext: IUserContext, queryObject: any, item: T): Promise<any>;
  deleteById(userContext: IUserContext, id: string): Promise<DeleteResult>;
  find(userContext: IUserContext, mongoQueryObject: any, options?: FindOptions<Document> | undefined): Promise<T[]>;
  findOne(userContext: IUserContext, mongoQueryObject: any, options?: FindOptions<Document> | undefined): Promise<T>;
}
