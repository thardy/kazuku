import {Component, OnInit} from '@angular/core';
import {User} from "./user.model";
import {UserService} from "./user.service";
import {Router} from "@angular/router";

@Component({
    selector: 'kz-user-list',
    templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {

    users: User[] = [];

    constructor(private userService: UserService, private router: Router) {
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
