import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {UserService} from "../../users/user.service";

@Component({
    selector: 'kz-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.less']
})
export class NavBarComponent implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(private userService: UserService, private router: Router) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    logout() {
        this.userService.logout()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
                () => {
                    this.router.navigate(['login']);
                },
                (error) => {
                    this.router.navigate(['login']);
                }
            );
    }

}
