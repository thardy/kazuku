import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs';


import {GenericService} from '../common/generic.service';
import {CustomSchema} from 'app/custom-schemas/custom-schema.model';
import {HttpService} from '../common/http.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class CustomSchemaService extends GenericService<CustomSchema> {

    constructor(@Inject(HttpService) http) {
        super('customSchemas', http);
    }

    getByContentType(contentType: string) {
        return this.http.get(`${this.baseUrl}/${contentType}`)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    updateByContentType(contentType: string, item: CustomSchema): Observable<CustomSchema> {
        return this.http.put(`${this.baseUrl}/${contentType}`, item)
            .pipe(
                map(response => this.extractAnyData(response)),
                catchError(error => this.handleError(error))
            );
    }

    deleteByContentType(contentType: string) {
        return this.http.delete(`${this.baseUrl}/${contentType}`)
            .pipe(
                catchError(error => this.handleError(error))
            );
    }

}

