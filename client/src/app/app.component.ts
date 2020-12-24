import {Component, OnInit} from '@angular/core';
import {AuthService} from './common/auth/auth.service';

@Component({
    selector: 'kz-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    isCollapsed = false;

    constructor(private userService: AuthService) {

    }

    ngOnInit() {}

    logout() {
        this.userService.logout();
    }

}
