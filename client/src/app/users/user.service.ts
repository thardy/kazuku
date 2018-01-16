import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import {environment} from '../../environments/environment';
import {User} from './user.model';
import {UserContext} from './user-context.model';
import {GenericService} from '../common/generic.service';
import {HttpService} from '../common/http.service';

@Injectable()
export class UserService extends GenericService<User> {
    private _currentUserContext: BehaviorSubject<UserContext>;
    private dataStore: {  // This is where we will store our data in memory
        userContext: UserContext
    };

    constructor(@Inject(HttpService) http) {
        super('users', http);
        this.dataStore = {userContext: new UserContext()};
        this._currentUserContext = <BehaviorSubject<UserContext>>new BehaviorSubject(new UserContext());

    }

    get currentUserContext() {
        return this._currentUserContext.asObservable();
    }

    login(email: string, password: string) {
        return this.http.post(`${this.baseUrl}/login`, {email: email, password: password})
            .map(response => this.extractData(response)) // we want to let the subscribers check the response.status
            .catch((error) => this.handleError(error));
    }

    logout() {
        return this.http.get(`${this.baseUrl}/logout`)
            .do((result) => {
                this.dataStore.userContext = new UserContext();
                // Send out an empty UserContext to all subscribers
                this._currentUserContext.next(Object.assign({}, this.dataStore.userContext));
            })
            .catch((error) => this.handleError(error));
    }

    getUserContext() {
        //return this.http.get(`${this.baseUrl}/getloggedinuser`)
        return this.http.get(`${this.baseUrl}/getusercontext`)
            .map(response => <UserContext>this.extractAnyData(response))
            .do(userContext => {
                    this.dataStore.userContext = userContext;
                    // subscribers get copies of the user, not the user itself, so any changes they make do not propagate back
                    this._currentUserContext.next(Object.assign({}, this.dataStore.userContext));
                }
            )
            .catch(error => this.handleError(error));

    }

    isLoggedIn() {
        return (this.dataStore.userContext && this.dataStore.userContext.user && this.dataStore.userContext.user.id) ? true : false;
    }

    clearClientsideAuth() {
        this.dataStore.userContext = new UserContext();
        // Send out an empty UserContext to all subscribers
        this._currentUserContext.next(Object.assign({}, this.dataStore.userContext));
    }

    handleError(error) {
        console.log(error);
        return Observable.throw(error || 'Server error');
    }

}
