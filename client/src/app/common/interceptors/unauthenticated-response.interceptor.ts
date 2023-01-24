import {Injectable, Injector, OnDestroy} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class UnAuthenticatedResponseInterceptor implements HttpInterceptor, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(private injector: Injector) {
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(req);
        return next.handle(req).pipe(
            tap(event => {
            }, err => {
                if (err instanceof HttpErrorResponse && err.status === 401 || err.status === 403) {
                    const authService = this.injector.get(AuthService);
                    const error = err.status === 401 ? 'Unauthenticated' : 'Unauthorized';

                    console.log(`${error} request made to a secure api without a valid token... logging out.`);
                    authService.clearClientsideAuth();
                    authService.navigateToLogin();
                }
            })
        );
    }
}
