import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';


import {Organization} from './organization.model';
import {GenericService} from '../common/generic.service';
import {HttpService} from '../common/http.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class OrganizationService extends GenericService<Organization> {

    constructor(@Inject(HttpService) http) {
        super('organizations', http);
    }

    getByName(name: string) {
        return this.http.get(`${this.baseUrl}/getbyname/${name}`)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

}
