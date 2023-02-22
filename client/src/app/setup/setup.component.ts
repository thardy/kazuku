import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SetupService} from './setup.service';
import {SetupConfig, SetupConfigForm} from './setup-config.model';
import {Subject} from 'rxjs';
import {AuthService} from '@common/auth/auth.service';
import {FormControl, FormGroup} from "@angular/forms";


@Component({
    selector: 'kz-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit, OnDestroy {
    setupConfig: SetupConfig;
    setupConfigForm: FormGroup = new FormGroup<SetupConfigForm>({
        adminPassword: new FormControl(''),
        adminPasswordConfirm: new FormControl(''),
        metaOrgName: new FormControl(''),
        metaOrgCode: new FormControl(''),
    });
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(private setupService: SetupService, private authService: AuthService, private router: Router) {
        // this.setupConfig.metaOrgCode = 'admin';
    }

    ngOnInit() {
        this.setupConfigForm.get('metaOrgCode').patchValue('admin');
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


    handleSetup() {
        console.log(this.setupConfigForm);
        if (this.setupConfigForm.valid) {
            this.setupConfig = new SetupConfig({
                ...this.setupConfigForm.value
            });
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
        } else {
            /**
             * Figure out what is wrong and let the user know.
             */
            // TODO: Figure out what is wrong with the form and how to inform the user.
        }
        // console.log(form);
        // console.log(this.setupConfig);

    }
}
