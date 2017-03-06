import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {environment} from "../../environments/environment";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Template} from "./template.model";

@Injectable()
export class TemplateService {

    private baseUrl: string;

    constructor(private http: Http) {
        this.baseUrl =  `${environment.kazukuApiUrl}/templates`;
    }

    getAll() {
        return this.http.get(this.baseUrl)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    getById(id: number) {
        return this.http.get(`${this.baseUrl}/${id}`)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    getByName(name: string) {
        return this.http.get(`${this.baseUrl}/getbyname/${name}`)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    create(template: Template) {
        return this.http.post(`${this.baseUrl}`, template)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    update(template: Template) {
        return this.http.put(`${this.baseUrl}`, template)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    extractData(template: Response) {
        let data = template.json();
        return data.data || {};
    }

    handleError(error) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
