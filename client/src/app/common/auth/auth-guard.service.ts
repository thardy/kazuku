import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterState, RouterStateSnapshot} from '@angular/router';
import {CanActivate} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {UserService} from "../../users/user.service";

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private userService: UserService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.userService.isLoggedIn()) {
            // check for logged-in user.  If we already have a cookie, don't make the user log in again
            this.userService.getLoggedInUser()
                .catch((error: any) => {
                    if (error.status === 401) {
                        this.router.navigate(['login']);
                    }

                    return Observable.of(null);
                })
                .subscribe((user) => {
                    if (!user) {
                        // need to redirect to login screen
                        this.router.navigateByUrl(`login?returnUrl=${state.url}`);
                    }
                    else {
                        // take them where they wanted to go
                        this.router.navigateByUrl(state.url);
                    }
                });

            return false;
        }

        return true;
    }

}

