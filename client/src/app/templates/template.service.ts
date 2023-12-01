import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';


import {Template} from './template.model';
import {GenericService} from '@common/generic.service';
import {HttpService} from '@common/http.service';
import {catchError, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TemplateService extends GenericService<Template> {

    constructor(@Inject(HttpService) http) {
        super('templates', http);
    }

    getByNameId(nameId: string) {
        return this.http.get(`${this.baseUrl}/get-by-name-id/${nameId}`)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    getAllPages() {
        return this.http.get(`${this.baseUrl}/get-all-pages`)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    getAllNonPageTemplates() {
        return this.http.get(`${this.baseUrl}/get-all-non-page-templates`)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

}
