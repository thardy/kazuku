import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SetupConfig} from './setup-config.model';
import {GenericService} from '../common/generic.service';
import {HttpService} from '../common/http.service';

@Injectable()
export class SetupService extends GenericService<SetupConfig> {

    constructor(@Inject(HttpService) http) {
        super('setup', http);
    }

    initialSetup(setupConfig: SetupConfig) {
        return this.http.post(`${this.baseUrl}/initialsetup`, setupConfig)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    canWeSetup() {
        return this.http.get(`${this.baseUrl}/setupstate`)
            .map((response: any) => {
                const setupCompleted = (response && response.data && response.data.setupCompleted) ? response.data.setupCompleted : false;
                return !setupCompleted;
            })
            .catch(error => this.handleError(error));
    }

}
