import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {GenericService} from '../common/generic.service';
import {CustomSchema} from 'app/custom-schemas/custom-schema.model';
import {HttpService} from '../common/http.service';

@Injectable()
export class CustomSchemaService extends GenericService<CustomSchema> {

    constructor(@Inject(HttpService) http) {
        super('customSchemas', http);
    }

    getByContentType(contentType: string) {
        return this.http.get(`${this.baseUrl}/${contentType}`)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    updateByContentType(contentType: string, item: CustomSchema): Observable<CustomSchema> {
        return this.http.put(`${this.baseUrl}/${contentType}`, item)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    deleteByContentType(contentType: string) {
        return this.http.delete(`${this.baseUrl}/${contentType}`)
            .catch(error => this.handleError(error));
    }

}

