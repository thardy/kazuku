import {IUserContext} from '../models/user-context.interface';

export interface IGenericApiService<T> {
  getAll(userContext: IUserContext): Promise<T[]>;
  getById(userContext: IUserContext, id: string): Promise<T>;
  create(userContext: IUserContext, item: T): Promise<T>;
  updateById(userContext: IUserContext, id: string, item: T): Promise<T>;
  deleteById(userContext: IUserContext, id: string): Promise<void>;
}
