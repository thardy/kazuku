import {Injectable, Injector, OnDestroy} from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {Subject} from 'rxjs/Subject';
import {UserService} from './users/user.service';

@Injectable()
export class UnAuthenticatedInterceptor implements HttpInterceptor, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(private injector: Injector) {}

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).do(event => {}, err => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
                const userService = this.injector.get(UserService);

                console.log('Unauthenticated request made to a secure api... logging out.');
                userService.clearClientsideAuth();
                window.location.href = `/#/login`;
                window.location.reload();
            }
        });
    }
}
