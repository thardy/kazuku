import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {environment} from "../../environments/environment";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GenericService<T> {

    protected baseUrl: string;
    protected http: Http;

    constructor(resourceName: string, http: Http) {
        this.baseUrl =  `${environment.kazukuApiUrl}/${resourceName}`;
        this.http = http;
    }

    getAll(): Observable<T[]> {
        return this.http.get(this.baseUrl)
            .map(response => this.extractDataList(response))
            .catch(error => this.handleError(error));
    }

    getById(id: number): Observable<T> {
        return this.http.get(`${this.baseUrl}/${id}`)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    create(item: T): Observable<T> {
        return this.http.post(`${this.baseUrl}`, item)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    update(item: T): Observable<T> {
        return this.http.put(`${this.baseUrl}`, item)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    extractDataList(response: Response) {
        let data = response.json();
        return <T[]>data.data || [];
    }

    extractData(response: Response) {
        let data = response.json();
        return <T>data.data || {};
    }

    handleError(error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}


