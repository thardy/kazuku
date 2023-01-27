import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let allow = false;
        // const requiredFeature = route.data ? route.data.feature : null;
        let promise = Promise.resolve(allow);

        if (!this.authService.isLoggedIn()) {
            /**
             * check for logged-in user.  If we already have a token, don't make the user log in again
             */
            promise = this.authService.getCurrentAuthContext()
                .then(() => {
                    /**
                     * if we weren't logged in before, we might be now (refresh token could have been used)
                     */
                    if (this.authService.isLoggedIn()) {
                        console.log('allow');
                        //allow = requiredFeature ? this.authService.isUserAuthorizedForFeature(requiredFeature) : true;
                        allow = true;
                        // if (!allow) {
                        //     this.displayUnauthorizedPopup(requiredFeature);
                        // }
                    }
                    else {
                        /**
                         * the user is not even logged in - send them to the login page.  this isn't the same as simply not
                         * having access to a specific feature.
                         */
                        console.log('User not logged in...routing to login');
                        this.authService.navigateToLogin();
                        allow = false;
                    }

                    return allow;
                })
                // .catch((error: any) => {
                //     if (error.status === 401) {
                //         this.authService.navigateToLogin();
                //     }
                //
                //     return false;
                // });

            promise = Promise.resolve(allow);
        }
        else {
            // allow = requiredFeature ? this.authService.isUserAuthorizedForFeature(requiredFeature) : true;
            // if (!allow) {
            //     this.displayUnauthorizedPopup(requiredFeature);
            // }
            allow = true;
            promise = Promise.resolve(allow);
        }

        return promise;
    }
}

