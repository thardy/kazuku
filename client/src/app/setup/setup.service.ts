import {Injectable, Inject} from '@angular/core';
import {Http, Response} from "@angular/http";
import {environment} from "../../environments/environment";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {SetupConfig} from "./setup-config.model";
import {GenericService} from "../common/generic.service";

@Injectable()
export class SetupService extends GenericService<SetupConfig> {

    constructor(@Inject(Http) http) {
        super('setup', http);
    }

    initialSetup(setupConfig: SetupConfig) {
        return this.http.post(`${this.baseUrl}/initialsetup`, setupConfig)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    canWeSetup() {
        return this.http.get(`${this.baseUrl}/setupstate`)
            .map((response) => {
                let data = response.json()
                let setupCompleted = (data && data.data && data.data.setupCompleted) ? data.data.setupCompleted : false;
                return !setupCompleted;
            })
            .catch(error => this.handleError(error));
    }

}
