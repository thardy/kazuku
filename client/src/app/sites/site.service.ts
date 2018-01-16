import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Site} from './site.model';
import {GenericService} from '../common/generic.service';
import {HttpService} from '../common/http.service';

@Injectable()
export class SiteService extends GenericService<Site> {

    constructor(@Inject(HttpService) http) {
        super('sites', http);
    }

    getByName(name: string) {
        return this.http.get(`${this.baseUrl}/getbyname/${name}`)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

}

