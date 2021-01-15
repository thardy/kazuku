import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterState, RouterStateSnapshot} from '@angular/router';
import {CanActivate} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from './auth.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let allow = false;
        // const requiredFeature = route.data ? route.data.feature : null;
        let promise = Promise.resolve(allow);

        if (!this.authService.isLoggedIn()) {
            // check for logged-in user.  If we already have a cookie, don't make the user log in again
            promise = this.authService.getAuthenticatedUserFromServer()
                .then((userContext) => {
                    if (this.authService.isLoggedIn()) {
                        // // allow = requiredFeature ? this.authService.isUserAuthorizedForFeature(requiredFeature) : true;
                        allow = true;
                        // // take them where they wanted to go
                        // this.router.navigateByUrl(state.url);
                    }
                    else {
                        allow = false;
                        // // need to redirect to login screen
                        // this.router.navigateByUrl(`login?returnUrl=${state.url}`);
                    }
                    return allow;
                })
                .catch((error: any) => {
                    if (error.status === 401) {
                        this.authService.navigateToLogin();
                    }

                    return false;
                });

                // .pipe(
                //     catchError((error: any) => {
                //         if (error.status === 401) {
                //             this.router.navigate(['login']);
                //         }
                //
                //         return of(null);
                //     })
                // )
                // .subscribe((userContext) => {
                //     if (!userContext) {
                //         // need to redirect to login screen
                //         this.router.navigateByUrl(`login?returnUrl=${state.url}`);
                //     } else {
                //         // take them where they wanted to go
                //         this.router.navigateByUrl(state.url);
                //     }
                // });


            promise = Promise.resolve(allow);
        }
        else {
            // allow = requiredFeature ? this.authService.isUserAuthorizedForFeature(requiredFeature) : true;
            allow = true;
            promise = Promise.resolve(allow);
        }

        return promise;
    }

}

