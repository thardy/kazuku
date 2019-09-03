
import {throwError as observableThrowError, Observable, BehaviorSubject} from 'rxjs';
import {Injectable, Inject} from '@angular/core';

import {environment} from '../../environments/environment';
import {User} from './user.model';
import {UserContext} from './user-context.model';
import {GenericService} from '../common/generic.service';
import {HttpService} from '../common/http.service';
import {catchError, map, tap} from 'rxjs/operators';

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

    get currentUserContext(): Observable<any> {
        return this._currentUserContext.asObservable();
    }

    login(email: string, password: string) {
        return this.http.post(`${this.baseUrl}/login`, {email: email, password: password})
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    logout() {
        return this.http.get(`${this.baseUrl}/logout`)
            .pipe(
                tap((result) => {
                    this.dataStore.userContext = new UserContext();
                    // Send out an empty UserContext to all subscribers
                    this._currentUserContext.next(Object.assign({}, this.dataStore.userContext));
                }),
                catchError((error) => this.handleError(error))
            );
    }

    getUserContext() {
        //return this.http.get(`${this.baseUrl}/getloggedinuser`)
        return this.http.get(`${this.baseUrl}/getusercontext`)
            .pipe(
                map(response => <UserContext>this.extractAnyData(response)),
                tap(userContext => {
                        this.dataStore.userContext = userContext;
                        // subscribers get copies of the user, not the user itself, so any changes they make do not propagate back
                        this._currentUserContext.next(Object.assign({}, this.dataStore.userContext));
                    }
                ),
                catchError(error => this.handleError(error))
            );

    }

    selectOrgContext(orgId: string) {
        if (this.dataStore.userContext.user.isMetaAdmin) {
            return this.http.put(`${this.baseUrl}/selectorgcontext`, {orgId: orgId})
                .pipe(
                    map(response => <UserContext>this.extractAnyData(response)),
                    tap(userContext => {
                            this.dataStore.userContext = userContext;
                            // subscribers get copies of the user, not the user itself, so any changes they make do not propagate back
                            this._currentUserContext.next(Object.assign({}, this.dataStore.userContext));
                        }
                    ),
                    catchError((error) => this.handleError(error))
                );
        }
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
        return observableThrowError(error || 'Server error');
    }

}
