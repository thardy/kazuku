import {BehaviorSubject, defer, Observable, of as observableOf, switchMap, throwError as observableThrowError} from 'rxjs';
import {Injectable} from '@angular/core';
import * as _ from 'lodash-es'
import {environment} from '../../../environments/environment';
import {UserContext} from './user-context.model';
import {HttpService} from '../http.service';
import {catchError, map, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AuthTokenCacheService} from './auth-token-cache.service';
import {LoginResponse} from './login-response.model';
import {KazukuAuthProviderService} from './kazuku-auth-provider.service';
import {IdentityProviderAuthState} from './identity-provider-auth-state.model';

@Injectable()
export class AuthService {
    private baseUrl: string;
    private identityProviderAuthStateSubject: BehaviorSubject<IdentityProviderAuthState>;
    authState$: Observable<IdentityProviderAuthState>;

    constructor(private http: HttpService,
                private store: Store<any>,
                private authTokenCacheService: AuthTokenCacheService,
                private authProvider: KazukuAuthProviderService) {
        this.baseUrl = `${environment.kazukuApiUrl}/auth`;
        this.identityProviderAuthStateSubject = new BehaviorSubject<IdentityProviderAuthState>(new IdentityProviderAuthState());
        this.authState$ = this.identityProviderAuthStateSubject.asObservable();
    }

    login(email: string, password: string) {
        /**
         * let's have login return a LoginResponse { tokens: {accessToken, refreshToken}, userContext }, and getUserContext
         * return just a userContext
         */
        return this.callLoginApi(email, password).pipe(
            switchMap((response) => this.handleLoginResponse(response))
        );
    }

    handleLoginResponse(loginResponse) {
        let userContext = null;

        let cachingPromise = Promise.resolve(null);
        if (loginResponse && loginResponse.tokens) {
            userContext = loginResponse.userContext;
            /**
             * Cache the accessToken and refresh token in IndexedDb
             */
            cachingPromise = this.authTokenCacheService.cacheTokens(loginResponse.tokens);
        }
        else {
            // login failed, so make sure we load authState with an empty object
            const emptyAuthState = new IdentityProviderAuthState();
            this.publishIdentityProviderAuthState(emptyAuthState);
        }

        return cachingPromise
            .then((cachingResult) => {
                let authState = null;
                if (cachingResult && loginResponse && loginResponse.tokens && loginResponse.tokens.accessToken) {
                    const accessToken = loginResponse.tokens.accessToken;
                    authState = new IdentityProviderAuthState({ isAuthenticated: true, accessToken});
                    /**
                     * update our in-memory authState - we store and are the source of truth for the authState$ just like Okta and Auth0 are
                     */
                    this.publishIdentityProviderAuthState(authState);
                }
                return authState;
            });
            // .catch((error) => {
            //     console.log(error);
            // });
    }

    private callLoginApi(email: string, password: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/login`, {email: email, password: password})
            .pipe(
                map(response => this.extractLoginResponse(response)),
                catchError(error => this.handleError(error))
            );
    }

    logout() {
        const promise = this.clearClientsideAuth()
            .then((result) => {
                this.navigateToLogin();
            })
            .catch((error) => {
                return this.handleError(error);
            });

        const observable = defer(() => promise)
        return observable;
    }

    autoAuthenticateIfPossible() {
        // returns a promise containing a live accessToken, or null.
        let promise = Promise.resolve(null);

        /**
         * Figure out if we currently have an authorized user logged in
         */
        if (this.isAuthenticated()) {
            /**
             * we know we are logged in, so just grab the authState from our identityProviderAuthStateSubject and get the accessToken
             */
            const authState = this.cloneAuthState();
            promise = Promise.resolve(authState.accessToken);
        } else {
            /**
             * We don't know if we are logged in - perhaps the user just hit F5, but we may have a live token cached.
             * Check for existing token.  If we don't have a live token cached, there's no need to ask the server - we know we are not authenticated
             */
            promise = this.getAccessToken()
                .then((accessToken) => {
                    let accessTokenPromise = Promise.resolve(null);
                    if (accessToken) {
                        /**
                         * we have a live token (jwt), make sure it is persisted to our identityProviderAuthStateSubject and return it
                         */
                        const authState = new IdentityProviderAuthState({ isAuthenticated: true, accessToken});
                        this.publishIdentityProviderAuthState(authState);
                        accessTokenPromise = Promise.resolve(authState.accessToken);
                    } else {
                        /**
                         * see if we can silently get a token, using our refreshToken, if we have one.
                         */
                        accessTokenPromise = this.acquireTokenSilent();
                    }

                    return accessTokenPromise;
                });
                // .then((userContextOrToken) => {
                //     /**
                //      * we either came in with a user or a token
                //      */
                //     let newPromise = Promise.resolve(null);
                //     if (userContextOrToken instanceof UserContext) {
                //         /**
                //          * we came in with a userContext - just return it.
                //          */
                //         newPromise = Promise.resolve(userContextOrToken);
                //     } else if (userContextOrToken && typeof userContextOrToken === 'string' || userContextOrToken instanceof String) {
                //         /**
                //          * we came in with a freshly refreshed token. Use it to get a user, and return that promise
                //          */
                //         newPromise = this.getAuthenticatedUserContextFromServer();
                //     }
                //     return newPromise;
                // });
        }

        return promise;


        // ****promise version****
        // let userPromise = Promise.resolve(null);
        //
        // // Figure out if we currently have an authorized user logged in
        // if (this.isAuthenticated()) {
        //   // we know we are logged in, so just grab the user from our userSubject
        //   const user = this.cloneCurrentUser();
        //   userPromise = Promise.resolve(user);
        // }
        // else {
        //   // todo: I don't know the impact of using await here.  test to make sure this is ok
        //   // We don't know if we are logged in - perhaps the user just hit F5, but we may have a live token cached.
        //   // Check for existing token.  If we don't have a live token cached, there's no need to ask the server - we know we are not authenticated
        //   const liveToken = await this.getAccessToken();
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

    // getAuthenticatedUserContextFromServer() {
    //     return this.http.get(`${this.baseUrl}/getusercontext`)
    //         .pipe(
    //             map(response => this.extractUserContext(response)),
    //             tap((userContext: UserContext) => {
    //                 this.store.dispatch(new LoadUserContextSuccess(userContext));
    //                 this.updateAuthState(userContext);
    //             }),
    //             catchError((error: any) => {
    //                 this.store.dispatch(new LoadUserContextFailure(error));
    //                 return this.handleError(error);
    //             })
    //         ).toPromise();
    //
    //     // .pipe(
    //     //     map(response => <UserContext>this.extractAnyData(response)),
    //     //     tap(userContext => {
    //     //             this.store.dispatch(new LoginUserSuccess(userContext));
    //     //             this.dataStore.userContext = userContext;
    //     //             // subscribers get copies of the user, not the user itself, so any changes they make do not propagate back
    //     //             this._currentUserContext.next(Object.assign({}, this.dataStore.userContext));
    //     //         }
    //     //     ),
    //     //     catchError(error => this.handleError(error))
    //     // );
    //
    // }

    // consider moving this out into a different service, one that does everything not included in actual authentication and will need
    //  to be called regardless of which identity provider is used (Okta, Auth0, KazukuAuth, etc).
    getUserContext() {
        return this.http.get(`${this.baseUrl}/getusercontext`)
            .pipe(
                map(response => this.extractUserContext(response)),
                // catchError((error: any) => {
                //     return this.handleError(error);
                // })
            );
    }

    // consider moving this out into a different service, one that does everything not included in actual authentication and will need
    //  to be called regardless of which identity provider is used (Okta, Auth0, KazukuAuth, etc).
    selectOrgContext(orgId: string) {
        return this.http.put(`${this.baseUrl}/selectorgcontext`, {orgId: orgId})
            .pipe(
                map(response => <UserContext>this.extractUserContext(response))
            );
    }

    isAuthenticated() {
        const authState = this.cloneAuthState();
        return Boolean(authState && authState.isAuthenticated);
    }

    async clearClientsideAuth(clearCachedTokens = true) {
        /**
         * Send out cleared authState to all subscribers
         */
        this.publishIdentityProviderAuthState(new IdentityProviderAuthState());

        if (clearCachedTokens) {
            /**
             * clear token cache
             */
            await this.authTokenCacheService.clearCachedTokens();
        }
    }

    getCachedRefreshToken() {
        /**
         * get tokenResponse from cache
         */
        return this.authTokenCacheService.getCachedTokens()
            .then((tokenResponse) => {
                /**
                 * returns null if we don't have a refreshToken cached
                 */
                let refreshToken = null;
                if (tokenResponse) {
                    refreshToken = tokenResponse.refreshToken;
                }
                return Promise.resolve(refreshToken);
            });
    }

    // updateAuthState(authState: IdentityProviderAuthState, persistLastUser = true) {
    //     let observable: any = observableOf(null);
    //
    //     if (authState) {
    //         this.publishIdentityProviderAuthState(authState);
    //
    //         observable = observableOf(authState);
    //         // if (userContext.preferences && userContext.preferences.defaultHomePage) {
    //         //     const currentUrl = window.location.href;
    //         //
    //         //     // don't navigate if we are already on the same page (I don't like having a refresh wipe out my search params in the querystring)
    //         //     if (!currentUrl.startsWith(environment.clientUrl.substring(0, environment.clientUrl.length) + '#' + userContext.preferences.defaultHomePage)) {
    //         //         this.router.navigate([userContext.preferences.defaultHomePage]);
    //         //     }
    //         // }
    //
    //         // if (persistLastUser) {
    //         //     this.offlineInfoService.save(OfflineInfoKeys.lastUser, userContext);
    //         // }
    //     }
    //
    //     return observable;
    // }

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
    }

    acquireTokenSilent() {
        return this.getCachedRefreshToken()
            .then((refreshToken) => {
                let promise = Promise.resolve(null);
                if (refreshToken) {
                    promise = this.authProvider.requestTokenUsingRefreshToken(refreshToken);
                } else {
                    console.log('No token found. Routing to login');
                    this.navigateToLogin();
                }
                return promise;
            })
            .then((tokenResponse) => {
                let promise = Promise.resolve(null);
                if (tokenResponse && tokenResponse.accessToken) {
                    /**
                     * cache the tokenResponse (contains both the accessToken and the refreshToken)
                     */
                    promise = this.authTokenCacheService.cacheTokens(tokenResponse);
                    // this.router.navigateByUrl('dashboard');
                }
                return promise;
            })
            .then((tokenResponse) => {
                let token = null;
                if (tokenResponse) {
                    token = tokenResponse.accessToken;
                    // this.router.navigateByUrl('dashboard');
                }
                return Promise.resolve(token);
            })
            .catch((error) => {
                this.clearClientsideAuth(false);
            });
    }

    getAccessToken() {
        /**
         * get tokens from cache - this only returns a token if it hasn't expired
         */
        return this.authTokenCacheService.getCachedTokens()
            .then((tokenResponse) => {
                /**
                 * returns null if we don't have a live token cached
                 */
                let accessToken = null;

                /**
                 * check to see if cached accessToken is live (not expired)
                 */
                if (tokenResponse && tokenResponse.accessToken) {
                    const now = Date.now();
                    /**
                     * milliseconds since Jan 1, 1970 UTC
                     */
                    const expiresOn = tokenResponse.expiresOn;
                    const isLive = expiresOn > now;
                    if (isLive) {
                        accessToken = tokenResponse.accessToken;
                    }
                }
                return Promise.resolve(accessToken);
            });
    }

    private extractLoginResponse(response: any) {
        let loginResponse = null;
        if (response) {
            if (response.userContext && response.userContext.preferences) {
                const preferences = JSON.parse(response.userContext.preferences);
                response.userContext.preferences = preferences;
            }

            loginResponse = new LoginResponse(response);
        }
        return loginResponse;
    }

    private extractUserContext(response: any): UserContext {
        let result = null;
        if (response) {
            result = new UserContext(response);
        }
        return result;
    }

    handleError(error) {
        console.log(error);
        return observableThrowError(() => error ?? 'Server error');
    }

    /**
     * We call clone here whenever we need to grab the current value of the BehaviorSubject, make a change, and send out that change.
     * We do this to grab a copy, make a change to the copy, and send that out.  We want to treat the value as immutable.  We never change
     * a value we've already published.
     * @private any
     */
    private cloneAuthState() {
        return _.cloneDeep(this.identityProviderAuthStateSubject.getValue());
    }

    private publishIdentityProviderAuthState(authState: IdentityProviderAuthState) {
        // next updates the current value in the BehaviorSubject and emits it to all subscribers
        this.identityProviderAuthStateSubject.next(authState);
    }

}
