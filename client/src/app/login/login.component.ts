import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from '../common/auth/auth.service';
import {Subject} from 'rxjs';
import {User} from '../common/auth/user.model';

import {Router, ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'kz-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup = new FormGroup({
        userName: new FormControl(''),
        password: new FormControl(''),
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

    login(form) {
        this.loggingIn = true;
        console.log(form);
        if (!form.invalid) {
            // this.authService.login(form.value.userName, form.value.password)
            //     .then((userContext) => {
            //         if (userContext) {
            //             if (userContext && this.returnUrl) {
            //                 this.router.navigate([this.returnUrl]);
            //             } else {
            //                 this.router.navigate(['dashboard']);
            //             }
            //         }
            //         // todo: make sure this handles failed logins correctly (is it handled in the service or auth-guard?) brah
            //
            //         this.loggingIn = false;
            //     })
            //     .finally(() => {
            //         this.loggingIn = false;
            //     });
        }
    }
}
