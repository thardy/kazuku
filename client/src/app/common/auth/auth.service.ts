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
import {KazukuAuthProviderService} from './kazuku-auth-provider.service';

@Injectable()
export class AuthService {
    private baseUrl: string;
    private userContextSubject: BehaviorSubject<UserContext>;
    userContext$: Observable<UserContext>;


    constructor(private http: HttpService,
                private store: Store<any>,
                private authTokenCacheService: AuthTokenCacheService,
                private authProvider: KazukuAuthProviderService) {
        this.baseUrl = `${environment.kazukuApiUrl}/auth`;
        this.userContextSubject = new BehaviorSubject<UserContext>(new UserContext());
        this.userContext$ = this.userContextSubject.asObservable();
    }

    login(email: string, password: string) {
        // let's have login return a LoginResponse { tokens: {accessToken, refreshToken}, userContext }, and getAuthenticatedUser return just a userContext
        return this.callLoginApi(email, password)
            .then((loginResponse) => {
                return this.handleLoginResponse(loginResponse);
            });
    }

    handleLoginResponse(loginResponse) {
        let userContext = null;

        let cachingPromise = Promise.resolve(null);
        if (loginResponse && loginResponse.tokens) {
            userContext = loginResponse.userContext;
            // Cache the accessToken and refresh token in IndexedDb
            cachingPromise = this.authTokenCacheService.cacheTokens(loginResponse.tokens);
        }

        return cachingPromise
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
    }

    private callLoginApi(email: string, password: string) {
        return this.http.post(`${this.baseUrl}/login`, {email: email, password: password})
            .pipe(
                map(response => this.extractLoginResponse(response)),
                catchError(error => this.handleError(error))
            ).toPromise();
    }

    async logout() {
        return this.clearClientsideAuth()
            .then((result) => {
                this.navigateToLogin();
            })
            .catch((error) => {
                return this.handleError(error);
            })
        // window.location.href = `/#/login`;
        // window.location.reload();
    }

    getCurrentAuthContext() {
        let promise = Promise.resolve(null);
        let userContext = null;

        // Figure out if we currently have an authorized user logged in
        if (this.isLoggedIn()) {
            // we know we are logged in, so just grab the user from our userSubject
            userContext = this.cloneUserContext();
            promise = Promise.resolve(userContext);
        }
        else {
            // We don't know if we are logged in - perhaps the user just hit F5, but we may have a live token cached.
            // Check for existing token.  If we don't have a live token cached, there's no need to ask the server - we know we are not authenticated
            promise = this.getLiveToken()
                .then((liveToken) => {
                    let userContextPromise = Promise.resolve(null);
                    if (liveToken) {
                        // we have a live token (jwt), get the currently authenticated userContext from the server
                        userContextPromise = this.getAuthenticatedUserContextFromServer();
                    }
                    else {
                        userContextPromise = this.acquireTokenSilent();
                    }

                    return userContextPromise;
                })
                .then((userContextOrToken) => {
                    // we either came in with a user or a token
                    let newPromise = Promise.resolve(null);
                    if (userContextOrToken instanceof UserContext) {
                        // we came in with a userContext - just return it.
                        newPromise = Promise.resolve(userContextOrToken);
                    }
                    else if (userContextOrToken && typeof userContextOrToken === 'string' || userContextOrToken instanceof String) {
                        // we came in with a freshly refreshed token. Use it to get a user, and return that promise
                        newPromise = this.getAuthenticatedUserContextFromServer();
                    }
                    return newPromise;
                });
        }

        return promise;


        // ****promise version****
        // let userPromise = Promise.resolve(null);
        //
        // // Figure out if we currently have an authorized user logged in
        // if (this.isLoggedIn()) {
        //   // we know we are logged in, so just grab the user from our userSubject
        //   const user = this.cloneCurrentUser();
        //   userPromise = Promise.resolve(user);
        // }
        // else {
        //   // todo: I don't know the impact of using await here.  test to make sure this is ok
        //   // We don't know if we are logged in - perhaps the user just hit F5, but we may have a live token cached.
        //   // Check for existing token.  If we don't have a live token cached, there's no need to ask the server - we know we are not authenticated
        //   const liveToken = await this.getLiveToken();
        //
        //   if (liveToken) {
        //     // we have a live token (jwt), get the currently authenticated user from the server
        //     userPromise = this.getAuthenticatedUserContextFromServer();
        //   }
        //   else {
        //     // we don't have a live token
        //     this.navigateToLogin();
        //     userPromise = Promise.resolve(null);
        //   }
        // }
        //
        // return userPromise;
    }

    getAuthenticatedUserContextFromServer() {
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

    handleInitialSetup() {

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
            await this.authTokenCacheService.clearCachedTokens();
        }
    }

    getCachedRefreshToken() {
        // get tokenResponse from cache
        return this.authTokenCacheService.getCachedTokens()
            .then((tokenResponse) => {
                let refreshToken = null; // returns null if we don't have a refreshToken cached
                if (tokenResponse) {
                    refreshToken = tokenResponse.refreshToken;
                }
                return Promise.resolve(refreshToken);
            });
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
        const allowedInsecurePaths = [
            'auth/login',
            'auth/logout',
            'auth/register',
            'auth/requesttokenusingauthcode',
            'auth/requesttokenusingrefreshtoken',
            'setup/initialsetup',
            'setup/setupstate'
        ];
        const allowedInsecureUrls = allowedInsecurePaths.map((path) => {
            return `${environment.kazukuApiUrl}/${path}`;
        })

        const isAllowedInsecureUrl = this.urlIsInPathList(url, allowedInsecureUrls);
        const isProtectedApiUrl = !isAllowedInsecureUrl;
        return isProtectedApiUrl;
    }

    urlIsInPathList(url, allowedInsecurePathList) {
        let urlIsInList;

        if (url.startsWith(environment.kazukuApiUrl)) {
            for (let i = 0; i < allowedInsecurePathList.length; i++) {
                if (url.startsWith(allowedInsecurePathList[i])) {
                    urlIsInList = true;
                    break;
                }
            }
        }

        return urlIsInList;
    }

    navigateToLogin() {
        console.log('Navigating to login page');
        window.location.href = `/#/login`;
        window.location.reload();
    }

    acquireTokenSilent() {
        return this.getCachedRefreshToken()
            .then((refreshToken) => {
                let promise = Promise.resolve(null);
                if (refreshToken) {
                    promise = this.authProvider.requestTokenUsingRefreshToken(refreshToken);
                }
                else {
                    this.navigateToLogin();
                }
                return promise;
            })
            .then((tokenResponse) => {
                let promise = Promise.resolve(null);
                if (tokenResponse && tokenResponse.accessToken) {
                    // cache the tokenResponse (contains both the accessToken and the refreshToken)
                    promise = this.authTokenCacheService.cacheTokens(tokenResponse);
                }
                return promise;
            })
            .then((tokenResponse) => {
                let token = null;
                if (tokenResponse) {
                    token = tokenResponse.accessToken;
                }
                return Promise.resolve(token);
            })
            .catch((error) => {
                // this.displayErrorGettingToken(error);
                this.clearClientsideAuth(false);
            });
    }

    getLiveToken() {
        // get tokens from cache
        return this.authTokenCacheService.getCachedTokens()
            .then((tokenResponse) => {
                let accessToken = null;  // returns null if we don't have a live token cached

                // check to see if cached accessToken is live (not expired)
                if (tokenResponse && tokenResponse.accessToken) {
                    const now = Date.now();
                    const expiresOn = tokenResponse.expiresOn; // milliseconds since Jan 1, 1970 UTC
                    const isLive = expiresOn > now;
                    if (isLive) {
                        accessToken = tokenResponse.accessToken;
                    }
                }
                return Promise.resolve(accessToken);
            });
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
