import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../common/auth/auth.service';
import {finalize, Subject} from 'rxjs';
import {User} from '../common/auth/user.model';

import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'kz-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup = new FormGroup({
        userName: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        rememberMe: new FormControl(false)
    });

    user: User = new User();
    returnUrl: string;
    loggingIn = false;

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    login() {
        console.log(this.loginForm);
        if (this.loginForm.valid) {
            this.loggingIn = true;
            this.authService.login(this.loginForm.value.userName, this.loginForm.value.password)
                .pipe(
                    finalize(() => this.loggingIn = false)
                )
                .subscribe((userContext) => {
                    if (userContext) {
                        if (userContext && this.returnUrl) {
                            this.router.navigate([this.returnUrl]);
                        } else {
                            this.router.navigate(['dashboard']);
                        }
                    }
                    // todo: make sure this handles failed logins correctly (is it handled in the service or auth-guard?) brah

                    this.loggingIn = false;
                })
        } else {
            /**
             * Inform user that the form fields are invalid.
             */
        }
    }


}
