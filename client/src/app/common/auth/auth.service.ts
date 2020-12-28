import {throwError as observableThrowError, Observable, BehaviorSubject, of as observableOf} from 'rxjs';
import {Injectable, Inject} from '@angular/core';
import * as _ from 'lodash'

import {environment} from '../../../environments/environment';
import {User} from './user.model';
import {UserContext} from './user-context.model';
import {GenericService} from '../generic.service';
import {HttpService} from '../http.service';
import {catchError, map, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {LoginUserSuccess} from '../../store/actions';

@Injectable()
export class AuthService {
    private baseUrl: string;
    private userContextSubject: BehaviorSubject<UserContext>;
    userContext$: Observable<UserContext>;


    constructor(private http: HttpService,
                private store: Store<any>) {
        this.baseUrl = `${environment.kazukuApiUrl}`;
        this.userContextSubject = new BehaviorSubject<UserContext>(new UserContext());
        this.userContext$ = this.userContextSubject.asObservable();
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

    getAuthenticatedUserFromServer() {
        //return this.http.get(`${this.baseUrl}/getloggedinuser`)
        return this.http.get(`${this.baseUrl}/getusercontext`)
            .pipe(
                map(response => this.extractData(response)),
                tap((userContext) => this.updateAuthContext(userContext)),
                catchError(error => this.handleError(error))
            ).toPromise();

            // .pipe(
            //     map(response => <UserContext>this.extractAnyData(response)),
            //     tap(userContext => {
            //             this.store.dispatch(new LoginUserSuccess(userContext));
            //             this.dataStore.userContext = userContext;
            //             // subscribers get copies of the user, not the user itself, so any changes they make do not propagate back
            //             this._currentUserContext.next(Object.assign({}, this.dataStore.userContext));
            //         }
            //     ),
            //     catchError(error => this.handleError(error))
            // );

    }

    selectOrgContext(orgId: string) {
        const userContext = this.cloneUserContext();

        if (userContext.user && userContext.user.isMetaAdmin) {
            return this.http.put(`${this.baseUrl}/selectorgcontext`, {orgId: orgId})
                .pipe(
                    map(response => <UserContext>this.extractAnyData(response)),
                    tap(selectedOrgContext => {
                            this.publishUserContext(selectedOrgContext);
                        }
                    ),
                    catchError((error) => this.handleError(error))
                );
        }
    }

    isLoggedIn() {
        const userContext = this.cloneUserContext();
        return Boolean(userContext && userContext.user.email);
    }

    async clearClientsideAuth(clearCachedTokens = true) {
        // Send out an empty user to all subscribers
        this.publishUserContext(new UserContext());

        if (clearCachedTokens) {
            // clear token cache
            //await this.authTokenCacheService.clearCachedTokenResponse();
        }

        //return this.offlineInfoService.delete(OfflineInfoKeys.lastUser);
    }

    updateAuthContext(userContext: UserContext, persistLastUser = true) {
        let observable = observableOf(null);

        if (userContext) {
            this.publishUserContext(userContext);

            observable = observableOf(userContext);
            // if (userContext.preferences && userContext.preferences.defaultHomePage) {
            //     const currentUrl = window.location.href;
            //
            //     // don't navigate if we are already on the same page (I don't like having a refresh wipe out my search params in the querystring)
            //     if (!currentUrl.startsWith(environment.clientUrl.substring(0, environment.clientUrl.length) + '#' + userContext.preferences.defaultHomePage)) {
            //         this.router.navigate([userContext.preferences.defaultHomePage]);
            //     }
            // }

            // if (persistLastUser) {
            //     this.offlineInfoService.save(OfflineInfoKeys.lastUser, userContext);
            // }
        }

        return observable;
    }

    // this should only be called from UserPreferenceService when prefs are saved
    // updatePreferencesOnCurrentUser(preferences: UserPreferences) {
    //     const userContext = this.cloneContext();
    //     userContext.preferences = preferences;
    //     this.publishUserContext(userContext);
    // }

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

    private extractData(response: any) {
        let userContext = null;
        if (response && response.data) {
            const data = response.data;
            const preferences = JSON.parse(data.preferences);
            data.preferences = preferences;
            userContext = new UserContext(data);
        }
        return userContext;
    }

    handleError(error) {
        console.log(error);
        return observableThrowError(error || 'Server error');
    }

    private cloneUserContext() {
        return _.cloneDeep(this.userContextSubject.getValue());
    }

    private publishUserContext(userContext: UserContext) {
        this.userContextSubject.next(userContext);
        //this.http.setNewUserContext(userContext);
    }

}
