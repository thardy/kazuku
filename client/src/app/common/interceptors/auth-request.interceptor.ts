import {Injectable, Injector} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {Observable, from as observableFromPromise, throwError as observableThrowError, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {catchError, mergeMap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class AuthRequestInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authService = this.injector.get(AuthService);
        let modifiedRequest = request;

        if (authService.isCallToSecureApi(request.url)) {
            const obs = observableFromPromise(
                authService.getCachedTokens()
                    // todo: put this in as soon as we get refreshTokens working
                    // .then((token) => {
                    //     return token ? Promise.resolve(token) : authService.acquireTokenSilent();
                    // })
                    .then((token) => {
                        modifiedRequest = this.modifyRequest(request, token);
                        return Promise.resolve(modifiedRequest);
                    })
            );
            return obs
                .pipe(
                    mergeMap((req) => {
                        return next.handle(req);
                    })
                );



        }
        else {
            return next.handle(modifiedRequest);
        }
    }

    modifyRequest(request, token) {
        // add access token to header
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            }
        });

        return request;
    }

}
