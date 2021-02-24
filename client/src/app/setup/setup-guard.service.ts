import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {CanActivate} from '@angular/router';
import {SetupService} from './setup.service';
import {map} from 'rxjs/operators';

//import 'rxjs/add/operator/do';

@Injectable()
export class SetupGuardService implements CanActivate {
    constructor(private setupService: SetupService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('Setup Guard');
        return this.setupService.canWeSetup()
            .pipe(
                map((canWeSetup) => {
                    if (!canWeSetup) {
                        this.router.navigate(['dashboard']);
                    }

                    return canWeSetup;
                })
            );
    }

}
