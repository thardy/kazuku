import {throwError as observableThrowError, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {BaseModel} from './base.model';
import JsonUtils from './utils/json-utils';
import {HttpService} from './http.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class GenericService<T extends BaseModel> {

    protected baseUrl: string;
    protected http: HttpService;

    constructor(resourceName: string, http: HttpService) {
        this.baseUrl = `${environment.kazukuApiUrl}/${resourceName}`;
        this.http = http;
    }

    getAll(params?: any): Observable<T[]> {
        return this.http.get(this.baseUrl, params).pipe(
            map(response => this.extractDataList(response)),
            catchError(error => this.handleError(error))
        );
    }

    getById(id: string): Observable<T> {
        return this.http.get(`${this.baseUrl}/${id}`).pipe(
            map(response => this.extractAnyData(response)),
            catchError(error => this.handleError(error))
        );
    }

    create(item: T): Observable<T> {
        console.log(item);
        return this.http.post(`${this.baseUrl}`, item).pipe(
            map(response => this.extractAnyData(response)),
            catchError(error => this.handleError(error))
        );
    }

    update(id: string, item: T): Observable<T> {
        return this.http.put(`${this.baseUrl}/${id}`, item).pipe(
            map(response => this.extractAnyData(response)),
            catchError(error => this.handleError(error))
        );
    }

    // todo: this might need some work (untested)
    delete(id: string) {
        return this.http.delete(`${this.baseUrl}/${id}`).pipe(
            catchError(error => this.handleError(error))
        );
    }

    extractDataList(response: any) {
        return <T[]>response || [];
    }

    extractData(response: any) {
        return <T>response || {};
    }

    extractAnyData(response: any) {
        return <any>response || {};
    }

    customExtractData<customType>(response: any) {
        return <customType>response || {};
    }

    extractNumberData(response) {
        if (response && typeof response === 'number') {
            return <number>response;
        } else {
            return 0;
        }
    }

    handleError(error) {
        console.error(error);
        return observableThrowError(error || 'Server error');
    }
}


