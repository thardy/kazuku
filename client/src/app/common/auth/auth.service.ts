import {throwError as observableThrowError, Observable, BehaviorSubject} from 'rxjs';
import {Injectable, Inject} from '@angular/core';

import {environment} from '../../../environments/environment';
import {User} from './user.model';
import {UserContext} from './user-context.model';
import {GenericService} from '../generic.service';
import {HttpService} from '../http.service';
import {catchError, map, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {LoginUserSuccess} from '../../store/actions';

@Injectable()
export class AuthService extends GenericService<User> {
    private userContextSubject: BehaviorSubject<UserContext>;
    userContext$: Observable<UserContext>;

    constructor(@Inject(HttpService) http,
                private store: Store<any>) {
        super('users', http);
        this.userContextSubject = new BehaviorSubject<UserContext>(new UserContext());
        this.userContext$ = this.userContextSubject.asObservable();
    }

    get currentUserContext(): Observable<any> {
        return this._currentUserContext.asObservable();
    }

    login(email: string, password: string) {
        return this.http.post(`${this.baseUrl}/login`, {email: email, password: password})
            .pipe(
                tap(res => console.log(res)),
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    private logoutOnServer() {
        return this.http.get(`${this.baseUrl}/logout`)
            .pipe(
                tap((result) => {
                    this.dataStore.userContext = new UserContext();
                    // Send out an empty UserContext to all subscribers
                    this._currentUserContext.next(Object.assign({}, this.dataStore.userContext));
                }),
                catchError((error) => this.handleError(error))
            )
            .toPromise();
    }

    async logout() {
        await this.logoutOnServer();

        this.clearClientsideAuth();
        window.location.href = `/#/login`;
        window.location.reload();
    }

    getUserContext() {
        //return this.http.get(`${this.baseUrl}/getloggedinuser`)
        return this.http.get(`${this.baseUrl}/getusercontext`)
            .pipe(
                map(response => <UserContext>this.extractAnyData(response)),
                tap(userContext => {
                        this.store.dispatch(new LoginUserSuccess(userContext));
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

    isCallToSecureApi(url: string) {
        let isProtectedApiUrl = false;

        if (url.startsWith(environment.kazukuApiUrl)) {
            if (url.startsWith(`${environment.kazukuApiUrl}/users/login`)
                || url.startsWith(`${environment.kazukuApiUrl}/users/logout`)
                || url.startsWith(`${environment.kazukuApiUrl}/users/register`)
                //|| url.startsWith(`${environment.kazukuApiUrl}/auth/requesttokenusingauthcode`)
                //|| url.startsWith(`${environment.kazukuApiUrl}/auth/requesttokenusingrefreshtoken`)
            ) {
                isProtectedApiUrl = false;
            }
            else {
                isProtectedApiUrl = true;
            }
        }
        return isProtectedApiUrl;
    }

    handleError(error) {
        console.log(error);
        return observableThrowError(error || 'Server error');
    }

}
