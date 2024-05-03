export interface IGenericApiService<T> {
  getAll(orgId: string): T[];
  getById(id: string): T;
  create(item: T): T;
  updateById(id: string, item: T): T;
  deleteById(id: string): void;
}
