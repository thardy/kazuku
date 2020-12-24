import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import * as _ from 'lodash';

const DB_INITIAL_VERSION = 1;
// const DB_USER_PREFERENCES_VERSION = 2;

@Injectable()
export class IdbService {
    dbUpgraded = false;
    currentDbVersion = DB_INITIAL_VERSION;
    oldDbVersion = this.currentDbVersion;
    db: any;
    dbConnected = false;

    constructor() { }

    async connectToIDB() {
        console.log(`IdbService connectToIDB()`);

        // create instance
        this.db = new Dexie('FleetMgrDb');

        // define schema
        this.db.version(DB_INITIAL_VERSION).stores({
            // all properties that need to be indexed go here
            tokenCache: 'id',
            lookups: 'id',
        });
        // this.db.version(DB_USER_PREFERENCES_VERSION).stores({
        //     userPreferences: 'email',
        // });

        // open the database
        return this.db.open()
            .catch((e) => {
                console.error(`db.open() failed: ${e}`);
            });
    }

    async deleteDatabase() {
        const db = new Dexie('Kazuku');
        return db.delete();
    }

    async addItem(storeName: string, item: any) {
        await this.db[storeName].add(item);
    }

    async batchAdd(storeName: string, items: any[]) {
        await this.db[storeName].bulkAdd(items);
    }

    async getAll(storeName: string) {
        return await this.db[storeName].toArray();
    }

    async getByKey(storeName: string, key) {
        return await this.db[storeName].get(key);
    }

    async batchGet(storeName: string, keys: any[]) {
        return await this.db[storeName].bulkGet(keys);
    }

    async updateByKey(storeName: string, key, item: any) {
        return await this.db[storeName].update(key, item);
    }

    async upsert(storeName: string, item: any, key?: any) {
        // this will either update the existing item or create a new one if it does not exist
        return await this.db[storeName].put(item, key);
    }

    async batchUpdate(storeName: string, items: any[]) {
        return await this.db[storeName].bulkPut(items);
    }

    async deleteAll(storeName: string) {
        await this.db[storeName].clear();
    }

    async deleteByKey(storeName: string, key) {
        await this.db[storeName].delete(key);
    }

    async batchDelete(storeName: string, keys) {
        await this.db[storeName].bulkDelete(keys);
    }

}
