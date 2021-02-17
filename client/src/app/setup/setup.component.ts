import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {SetupService} from './setup.service';
import {SetupConfig} from './setup-config.model';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AuthService} from '../common/auth/auth.service';


@Component({
    selector: 'kz-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.less']
})
export class SetupComponent implements OnInit, OnDestroy {
    setupConfig: SetupConfig;
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(private setupService: SetupService, private authService: AuthService, private router: Router) {
        this.setupConfig = new SetupConfig();
        this.setupConfig.metaOrgCode = 'admin';
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


    save(form) {
        console.log(form);
        console.log(this.setupConfig);
        this.setupService.initialSetup(this.setupConfig)
            .then((loginResponse) => {
                return this.authService.handleLoginResponse(loginResponse);
            })
            .then((userContext) => {
                if (userContext) {
                    this.router.navigate(['dashboard']);
                }
            })
    }
}
