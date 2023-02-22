import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';

import {SetupConfig} from './setup-config.model';
import {GenericService} from '@common/generic.service';
import {HttpService} from '@common/http.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class SetupService extends GenericService<SetupConfig> {

    constructor(@Inject(HttpService) http) {
        super('setup', http);
    }

    initialSetup(setupConfig: SetupConfig) {
        return this.http.post(`${this.baseUrl}/initialsetup`, setupConfig)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            ).toPromise();
    }

    canWeSetup() {
        return this.http.get(`${this.baseUrl}/setupstate`)
            .pipe(
                map((response: any) => {
                    const setupCompleted = (response && response.data && response.data.setupCompleted) ? response.data.setupCompleted : false;
                    return !setupCompleted;
                }),
                catchError(error => this.handleError(error))
            );
    }

}
