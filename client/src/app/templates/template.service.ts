import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';


import {Template} from './template.model';
import {GenericService} from '../common/generic.service';
import {HttpService} from '../common/http.service';
import {catchError, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TemplateService extends GenericService<Template> {

    constructor(@Inject(HttpService) http) {
        super('templates', http);
    }

    getByNameId(nameId: string) {
        return this.http.get(`${this.baseUrl}/getbynameid/${nameId}`)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    getAllPages() {
        return this.http.get(`${this.baseUrl}/getallpages`)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    getAllNonPageTemplates() {
        return this.http.get(`${this.baseUrl}/getallnonpagetemplates`)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

}
