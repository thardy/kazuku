import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {CanActivate} from '@angular/router';
import {SetupService} from "./setup.service";
//import 'rxjs/add/operator/do';

@Injectable()
export class SetupGuardService implements CanActivate {
    constructor(private setupService: SetupService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.setupService.canWeSetup()
            .map((canWeSetup) => {
                if (!canWeSetup) {
                    this.router.navigate(['dashboard']);
                }

                return canWeSetup;
            });
    }

}
