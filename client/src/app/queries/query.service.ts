import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';


import {Query} from './query.model';
import {GenericService} from '@common/generic.service';
import {HttpService} from '@common/http.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class QueryService extends GenericService<Query> {

    constructor(@Inject(HttpService) http) {
        super('queries', http);
    }

    getByNameId(nameId: string) {
        return this.http.get(`${this.baseUrl}/getbynameid/${nameId}`)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

}
