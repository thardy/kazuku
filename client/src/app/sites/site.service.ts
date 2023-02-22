import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';




import {Site} from './site.model';
import {GenericService} from '@common/generic.service';
import {HttpService} from '@common/http.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class SiteService extends GenericService<Site> {

    constructor(@Inject(HttpService) http) {
        super('sites', http);
    }

    getByName(name: string) {
        return this.http.get(`${this.baseUrl}/getbyname/${name}`)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

}

