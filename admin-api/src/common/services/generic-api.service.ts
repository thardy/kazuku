import { IGenericApiService } from './generic-api-service.interface';

export class GenericApiService<T> implements IGenericApiService<T> {
    getAll(orgId: string): T[] {
        throw new Error('Method not implemented.');
    }
    getById(id: string): T {
        throw new Error('Method not implemented.');
    }
    create(item: T): T {
        throw new Error('Method not implemented.');
    }
    updateById(id: string, item: T): T {
        throw new Error('Method not implemented.');
    }
    deleteById(id: string): void {
        throw new Error('Method not implemented.');
    }

}
