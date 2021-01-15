import {Injectable} from '@angular/core';
import {IdbService} from '../indexed-db/idb.service';
import {IdbStoreNames} from '../constants/idb-store-names.constants';

@Injectable()
export class AuthTokenCacheService {
    constructor(
        private idbService: IdbService,
    ) {}

    async cacheTokens(tokens) {
        // async/await version
        //await this.clearCachedTokenResponse();
        await this.idbService.deleteAll(IdbStoreNames.tokenCache);
        const dbItem = this.createSimpleDbItemFromObject(tokens);
        await this.idbService.addItem(IdbStoreNames.tokenCache, dbItem);
        return tokens;

        // pure promise version
        // return this.clearCachedTokenResponse()
        //     .then((result) => {
        //         // save the tokenResponse to local db (IndexedDB)
        //         return this.createSimpleDbItemFromObject(tokens);
        //     })
        //     .then((dbItem) => {
        //         // basically, just wait until the add is done, then return the tokens
        //         return this.idbService.addItem(IdbStoreNames.tokenCache, dbItem);
        //     });

    }

    getCachedTokens() {
        // the tokenResponse object is stored as id: 1
        // todo: test what this returns when the store is empty (I'm hoping null)
        return this.idbService.getByKey(IdbStoreNames.tokenCache, 1);
    }

    async clearCachedTokenResponse() {
        // clear out existing local tokenCache store
        return this.idbService.deleteAll(IdbStoreNames.tokenCache);
    }

    async adminDeleteAccessToken() {
        // the tokenResponse object is stored as id: 1
        const tokenResponse = await this.idbService.getByKey(IdbStoreNames.tokenCache, 1);

        // alter tokenResponse to delete accessToken
        tokenResponse.accessToken = undefined;

        const savedTokenResponse = await this.cacheTokens(tokenResponse);

        return savedTokenResponse;
    }

    private createSimpleDbItemFromObject(object: any) {
        // basically just adding an id = 1 to the object, so we can query it by id
        const dbItem = Object.assign({id: 1}, object);
        return dbItem;
    }
}
