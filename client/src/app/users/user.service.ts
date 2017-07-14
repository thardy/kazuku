import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import {environment} from "../../environments/environment";

@Injectable()
export class UserService {
    private baseUrl: string;

    constructor(private http: Http) {
        this.baseUrl = `${environment.kazukuApiUrl}/users`;
    }

    login(email: string, password: string) {
        return this.http.post(`${this.baseUrl}/login`, {email: email, password: password})
            .map(response => this.extractData(response)) // we want to let the subscribers check the response.status
            .catch((error) => this.handleError(error));
    }

    extractData(response: Response) {
        const data = response.json();
        return data || {};
    }

    handleError(error) {
        console.log(error);
        return Observable.throw(error || 'Server error');
    }

}
