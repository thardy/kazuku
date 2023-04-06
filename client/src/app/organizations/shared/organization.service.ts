import {Injectable, Inject} from '@angular/core';

import {Organization} from '@common/auth/organization.model';
import {catchError, map} from 'rxjs/operators';
import {GenericService} from '@common/generic.service';
import {HttpService} from '@common/http.service';

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
