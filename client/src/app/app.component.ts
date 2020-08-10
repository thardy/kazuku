import {Component, OnInit} from '@angular/core';
import {UserService} from './users/user.service';

@Component({
    selector: 'kz-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    isCollapsed = false;

    constructor(private userService: UserService) {

    }

    ngOnInit() {}

    logout() {
        this.userService.logout();
    }

}
