import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {environment} from "../../environments/environment";
import {Observable} from 'rxjs/Observable';
import {BaseModel} from './base.model';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import JsonUtils from './utils/json-utils';

@Injectable()
export class GenericService<T extends BaseModel> {

    protected baseUrl: string;
    protected http: Http;

    constructor(resourceName: string, http: Http) {
        this.baseUrl =  `${environment.kazukuApiUrl}/${resourceName}`;
        this.http = http;
    }

    getAll(params?: any): Observable<T[]> {
        return this.http.get(this.baseUrl, params)
            .map(response => this.extractDataList(response))
            .catch(error => this.handleError(error));
    }

    getById(id: string): Observable<T> {
        return this.http.get(`${this.baseUrl}/${id}`)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    create(item: T): Observable<T> {
        return this.http.post(`${this.baseUrl}`, item)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    update(id: string, item: T): Observable<T> {
        return this.http.put(`${this.baseUrl}/${id}`, item)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    // todo: this might need some work (untested)
    delete(id: string) {
        return this.http.delete(`${this.baseUrl}/${id}`)
            .catch(error => this.handleError(error));
    }


    extractDataList(response: Response) {
        let data = response.json();
        return <T[]>data || [];
    }

    extractData(response: Response) {
        let data = response.json();
        return <T>data || {};
    }

    handleError(error) {
        console.error(error);
        const jsonBody = JsonUtils.tryParseJSON(error._body);

        if (error.json && jsonBody) {
            return Observable.throw(jsonBody || 'Server error');
        }
        else {
            return Observable.throw(error || 'Server error');
        }

    }
}


