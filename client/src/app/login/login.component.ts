import {Component, OnInit, OnDestroy} from '@angular/core';
import {UserService} from '../users/user.service';
import {Subject} from 'rxjs';
import {User} from '../users/user.model';

import {Router, ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'kz-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    user: User = new User();
    returnUrl: string;
    loggingIn = false;

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
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
        if (!form.invalid) {
            this.userService.login(this.user.email, this.user.password)
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe(
                    (result) => {
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
