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
    styleUrls: ['./login.component.less']
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

    constructor(private userService: AuthService,
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
            this.userService.login(form.value.userName, form.value.password)
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe((result) => {
                        console.log(result);
                        // todo: fix this to check for valid login - there's no check!
                        if (this.returnUrl) {
                            this.router.navigate([this.returnUrl]);
                        } else {
                            this.router.navigate(['dashboard']);
                        }
                        this.loggingIn = false;
                    },
                    (error) => {
                        this.loggingIn = false;
                    },
                    () => {
                        this.loggingIn = false;
                    }
                );
        }
    }
}
