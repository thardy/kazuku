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
import {AuthTokenCacheService} from './auth-token-cache.service';
import {LoginResponse} from './login-response.model';
import {Tokens} from './tokens.model';

@Injectable()
export class AuthService {
    private baseUrl: string;
    private userContextSubject: BehaviorSubject<UserContext>;
    userContext$: Observable<UserContext>;


    constructor(private http: HttpService,
                private store: Store<any>,
                private authTokenCacheService: AuthTokenCacheService) {
        this.baseUrl = `${environment.kazukuApiUrl}/users`;
        this.userContextSubject = new BehaviorSubject<UserContext>(new UserContext());
        this.userContext$ = this.userContextSubject.asObservable();
    }

    login(email: string, password: string) {
        // todo: need to do the following...
        //  - we need to cache the token -> this.authTokenCacheService.cacheTokens(tokenResponse)
        //  - we need to get the user (either from the same response that gave us the token, or we need to make a separate call to get the authenticated userContext
        //  - consider encapsulating some of this in an authProvider class

        let userContext = null;

        // let's have login return a LoginResponse { tokens: {accessToken, refreshToken}, userContext }, and getAuthenticatedUser return just a userContext
        const loginPromise = this.callLoginApi(email, password)
            .then((loginResponse: LoginResponse) => {
                let cachingPromise = Promise.resolve(null);
                if (loginResponse && loginResponse.tokens) {
                    userContext = loginResponse.userContext;
                    // Cache the accessToken and refresh token in IndexedDb
                    //cachingPromise = this.cacheTokens(loginResponse.tokens); // will contain accessToken (the live jwt) and a refreshToken (used to get another jwt)
                    cachingPromise = this.authTokenCacheService.cacheTokens(loginResponse.tokens);
                }
                return cachingPromise;
            })
            .then((cachingResult) => {
                let updateContextPromise = Promise.resolve(null);
                if (cachingResult && userContext) {
                    // update our in-memory authContext
                    updateContextPromise = this.updateAuthContext(userContext).toPromise();
                }
                return updateContextPromise;
            })
            .catch((error) => {
                console.log(error);
            });

        return loginPromise;
    }

    private callLoginApi(email: string, password: string) {
        return this.http.post(`${this.baseUrl}/login`, {email: email, password: password})
            .pipe(
                map(response => this.extractLoginResponse(response)), // todo: extract the result properly - just use a typed response class (LoginResponse)
                catchError(error => this.handleError(error))
            ).toPromise();
    }

    private logoutOnServer() {
        return this.http.get(`${this.baseUrl}/logout`)
            .pipe(
                tap((result) => {
                    // Send out an empty UserContext to all subscribers
                    this.publishUserContext(new UserContext());
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
                map(response => this.extractUserContext(response)),
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
            // note that we don't return the observable here.  we subscribe ourselves, and if anyone wants the context, they
            //  should subscribe to userContext$.
            this.http.put(`${this.baseUrl}/selectorgcontext`, {orgId: orgId})
                .pipe(
                    map(response => <UserContext>this.extractUserContext(response)),
                    tap(newUserContext => {
                        this.updateAuthContext(newUserContext);
                    }),
                    catchError((error) => this.handleError(error))
                )
                .subscribe();
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

    navigateToLogin() {
        window.location.href = `/#/login`;
        window.location.reload();
    }

    getCachedTokens() {
        // get tokens from cache
        return this.authTokenCacheService.getCachedTokens()
            .then((tokenResponse) => {
                let token = null;  // returns null if we don't have a live token cached

                // check to see if cached accessToken is live (not expired)
                if (tokenResponse && tokenResponse.accessToken) {
                    const now = Date.now();
                    const expiresOn = tokenResponse.expiresOn; // milliseconds since Jan 1, 1970 UTC
                    const isLive = expiresOn > now;
                    if (isLive) {
                        token = tokenResponse.accessToken;
                    }
                }
                return Promise.resolve(token);
            });
    }

    private cacheTokens(tokens: Tokens) {
        // tokens must have accessToken and refreshToken properties
        return this.authTokenCacheService.cacheTokens(tokens);
    }

    private extractLoginResponse(response: any) {
        let loginResponse  = null;
        if (response) {
            if (response.userContext && response.userContext.preferences) {
                const preferences = JSON.parse(response.userContext.preferences);
                response.userContext.preferences = preferences;
            }

            loginResponse = new LoginResponse(response);
        }
        return loginResponse;
    }

    private extractUserContext(response: any) {
        let result  = null;
        if (response) {
            result = new UserContext(response);
        }
        return result;
    }

    handleError(error) {
        console.log(error);
        return observableThrowError(error || 'Server error');
    }

    // We call clone here whenever we need to grab the current value of the BehaviorSubject, make a change, and send out that change.
    //  We do this to grab a copy, make a change to the copy, and send that out.  We want to treat the value as immutable.  We never change
    //  a value we've already published.
    private cloneUserContext() {
        return _.cloneDeep(this.userContextSubject.getValue());
    }

    private publishUserContext(userContext: UserContext) {
        this.userContextSubject.next(userContext);
        //this.http.setNewUserContext(userContext);
    }

}
