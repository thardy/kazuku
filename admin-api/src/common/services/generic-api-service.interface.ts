export interface IGenericApiService<T> {
  getAll(orgId: string): Promise<T[]>;
  getById(id: string): Promise<T>;
  create(item: T): Promise<T>;
  updateById(id: string, item: T): Promise<T>;
  deleteById(id: string): Promise<void>;
}
