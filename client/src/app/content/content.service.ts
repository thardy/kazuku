import {Inject, Injectable} from '@angular/core';
import {GenericService} from '../common/generic.service';
import {HttpService} from '../common/http.service';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContentService extends GenericService<any> {

    constructor(@Inject(HttpService) http) {
        super('customData', http);
    }

    getAllByContentType(contentType: string) {
        return this.http.get(`${this.baseUrl}/${contentType}`)
            .pipe(
                map(response => this.extractDataList(response)),
                catchError(error => this.handleError(error))
            );
    }

    getByTypeAndId(contentType: string, id: string) {
        return this.http.get(`${this.baseUrl}/${contentType}/${id}`)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    createByContentType(contentType: string, item: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/${contentType}`, item)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    updateByTypeAndId(contentType: string, id: string, item: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/${contentType}/${id}`, item)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    deleteByTypeAndId(contentType: string, id: string) {
        return this.http.delete(`${this.baseUrl}/${contentType}/${id}`)
            .pipe(
                catchError(error => this.handleError(error))
            );
    }

}
