import {Component, OnInit, OnDestroy} from '@angular/core';
import {UserService} from "../users/user.service";
import {Subject} from 'rxjs/Subject';
import {User} from "../users/user.model";
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'kz-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {
    user: User = new User();
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(private userService: UserService) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    login(form) {
        if (!form.invalid) {
            this.userService.login(this.user.email, this.user.password)
                .takeUntil(this.ngUnsubscribe)
                .subscribe();
        }
    }
}
