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
        if (!this.authService.isLoggedIn()) {
            // check for logged-in user.  If we already have a cookie, don't make the user log in again
            this.authService.getAuthenticatedUserFromServer()
                .pipe(
                    catchError((error: any) => {
                        if (error.status === 401) {
                            this.router.navigate(['login']);
                        }

                        return of(null);
                    })
                )
                .subscribe((userContext) => {
                    if (!userContext) {
                        // need to redirect to login screen
                        this.router.navigateByUrl(`login?returnUrl=${state.url}`);
                    } else {
                        // take them where they wanted to go
                        this.router.navigateByUrl(state.url);
                    }
                });

            return false;
        }

        return true;
    }

}

