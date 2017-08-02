import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import {environment} from "../../environments/environment";
import {User} from "./user.model";

@Injectable()
export class UserService {
    private baseUrl: string;
    private _currentUser: BehaviorSubject<User>;
    private dataStore: {  // This is where we will store our data in memory
        user: User
    };

    constructor(private http: Http) {
        this.baseUrl = `${environment.kazukuApiUrl}/users`;
        this.dataStore = { user: null };
        this._currentUser = <BehaviorSubject<User>>new BehaviorSubject(new User());
    }

    get currentUser() {
        return this._currentUser.asObservable();
    }

    login(email: string, password: string) {
        return this.http.post(`${this.baseUrl}/login`, {email: email, password: password})
            .map(response => this.extractData(response)) // we want to let the subscribers check the response.status
            .catch((error) => this.handleError(error));
    }

    logout() {
        return this.http.get(`${this.baseUrl}/logout`)
            .map(response => this.extractData(response))
            .catch((error) => this.handleError(error));
    }

    getLoggedInUser() {
        return this.http.get(`${this.baseUrl}/getloggedinuser`)
            .map(response => <User>this.extractData(response))
            .do(
                (user) => {
                    this.dataStore.user = user;
                    // subscribers get copies of the user, not the user itself, so any changes they make do not propagate back
                    this._currentUser.next(Object.assign(new User(), this.dataStore.user));
                },
                (error) => {
                    this.handleError(error);
                }
            )
            .catch(error => this.handleError(error));
    }

    isLoggedIn() {
        return this.dataStore.user ? true : false;
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
