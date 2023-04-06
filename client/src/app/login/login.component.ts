import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '@common/auth/auth.service';
import {User} from '@common/auth/user.model';

import {ActivatedRoute, Router} from '@angular/router';
import * as AuthActions from '@common/auth/store/auth.actions';
import * as AuthActions from '../common/auth/store/auth.actions';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {finalize} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'kz-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup = new FormGroup({
        userName: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        rememberMe: new FormControl(false)
    });

    user: User = new User();
    returnUrl: string;
    loggingIn = false;

    // todo: auth - clean out the unneeded dependencies
    constructor(private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private store: Store,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    }

    login() {
        console.log(this.loginForm);

        if (this.loginForm.valid) {
            this.loggingIn = true;
            this.authService.login(this.loginForm.value.userName, this.loginForm.value.password)
                .pipe(
                    tap((authState) => {
                        if (authState) {
                            // Okta and Auth0 handle redirecting to wherever you originally intended to go to via their callback components,
                            //  so we need to handle redirection ourselves as well (outside of NgRx).
                            if (authState && this.returnUrl) {
                                this.router.navigate([this.returnUrl]);
                            } else {
                                this.router.navigate(['dashboard']);
                            }
                        }
                        this.loggingIn = false;
                    }),
                    finalize(() => this.loggingIn = false)
                )
                .subscribe();
        } else {
            /**
             * Inform user that the form fields are invalid.
             */
        }
    }


}
