import {Component, OnInit} from '@angular/core';
import {User} from "../common/auth/user.model";
import {AuthService} from "../common/auth/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'kz-user-list',
    templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {

    users: User[] = [];

    constructor(private userService: AuthService, private router: Router) {
    }

    ngOnInit() {
        this.userService.getAll()
            .subscribe((users) => {
                this.users = users;
            });
    }

    create() {
        this.router.navigateByUrl('users/create');
    }

}
