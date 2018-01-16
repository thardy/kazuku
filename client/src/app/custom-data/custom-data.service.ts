import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {GenericService} from '../common/generic.service';
import {HttpService} from '../common/http.service';

@Injectable()
export class CustomDataService extends GenericService<any> {

    constructor(@Inject(HttpService) http) {
        super('customData', http);
    }

    getAllByContentType(contentType: string) {
        return this.http.get(`${this.baseUrl}/${contentType}`)
            .map(response => this.extractDataList(response))
            .catch(error => this.handleError(error));
    }

    getByTypeAndId(contentType: string, id: string) {
        return this.http.get(`${this.baseUrl}/${contentType}/${id}`)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    createByContentType(contentType: string, item: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/${contentType}`, item)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    updateByTypeAndId(contentType: string, id: string, item: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/${contentType}/${id}`, item)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    deleteByTypeAndId(contentType: string, id: string) {
        return this.http.delete(`${this.baseUrl}/${contentType}/${id}`)
            .catch(error => this.handleError(error));
    }

}
