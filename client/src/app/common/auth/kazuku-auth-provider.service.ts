import {Inject, Injectable, OnInit} from '@angular/core';
import {IAuthProvider} from './auth-provider.interface';
import { environment } from '../../../environments/environment';
import {of as observableOf, throwError as observableThrowError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpService} from '../http.service';
import {GenericService} from '../generic.service';
import {Tokens} from './tokens.model';

@Injectable()
export class KazukuAuthProviderService implements IAuthProvider {
    baseUrl: string;

    constructor(private http: HttpService) {
        this.baseUrl = `${environment.kazukuApiUrl}/auth`;
    }

    createModel(options: any) {
        return new Tokens(options);
    }

    // redirectToAuthProviderLogin(): void {
    //     // redirect to third-party login page (for oauth)
    //     const loginUri = this.getLoginUri();
    //
    //     window.location.href = loginUri;
    // }

    // requestTokenUsingAuthCode(authCode: string) {
    //     return this.http.get(`${this.baseUrl}/requesttokenusingauthcode?authCode=${authCode}`)
    //         .pipe(
    //             map((data: any) => this.extractRequestTokenData(data)),
    //             //catchError(error => this.handleRequestTokenError(error))
    //         ).toPromise();
    // }

    // this is the only function we will be using from the start.  The others are all to support oauth (third party login/credential swap)
    requestTokenUsingRefreshToken(refreshToken: string) {
        return this.http.get(`${this.baseUrl}/requesttokenusingrefreshtoken?refreshToken=${refreshToken}`)
            .pipe(
                map((data: any) => this.extractTokens(data)),
                catchError(error => this.handleRequestTokenError(error))
            ).toPromise();
    }

    // private getLoginUri() {
    //     const uriEncodedRedirectUri = encodeURIComponent(environment.authProviderRedirectUri);
    //
    //     const uriEncodedScopes = encodeURIComponent(environment.authProviderAuthScopes);
    //     const loginUrl = `https://${environment.authProviderHostname}/${environment.authProviderTenantId}/oauth2/v2.0/authorize?client_id=${environment.authProviderAuthClientAppId}&response_type=code&redirect_uri=${uriEncodedRedirectUri}&response_mode=query&scope=${uriEncodedScopes}%20offline_access&state=12345`;
    //     return loginUrl;
    // }

    // private createBodyUsingAuthCode(authCode: string) {
    //   const uriEncodedRedirectUri = encodeURIComponent(environment.azureAuthRedirectUri);
    //   const uriEncodedScopes = encodeURIComponent(environment.azureAuthScopes);
    //
    //   const body = `client_id=${environment.azureAuthClientAppId}&scope=${uriEncodedScopes}%20offline_access&redirect_uri=${uriEncodedRedirectUri}&code=${authCode}&grant_type=authorization_code`;
    //
    //   return body;
    // }
    //
    // private createBodyUsingRefreshToken(refreshToken: string) {
    //   const uriEncodedRedirectUri = encodeURIComponent(environment.azureAuthRedirectUri);
    //   const uriEncodedScopes = encodeURIComponent(environment.azureAuthScopes);
    //
    //   const body = `client_id=${environment.azureAuthClientAppId}&scope=${uriEncodedScopes}%20offline_access&refresh_token=${refreshToken}&grant_type=refresh_token`;
    //
    //   return body;
    // }

    extractTokens(response: any): Tokens {
        let item = null;
        const createModelFunc = this['createModel'];

        if (!createModelFunc) {
            item = <Tokens>response || {};
        }
        else if (response) {
            item = createModelFunc(response);
        }

        return item;
    }

    private handleRequestTokenError(error) {
      console.error(error);
      return observableThrowError(() => error ?? 'Server error');
    }
}
