import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Query} from './query.model';
import {GenericService} from '../common/generic.service';
import {HttpService} from '../common/http.service';

@Injectable()
export class QueryService extends GenericService<Query> {

    constructor(@Inject(HttpService) http) {
        super('queries', http);
    }

    getByNameId(nameId: string) {
        return this.http.get(`${this.baseUrl}/getbynameid/${nameId}`)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

}
