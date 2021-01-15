import {Component, OnInit} from '@angular/core';
import {User} from '../common/auth/user.model';
import {Router} from '@angular/router';
import {UserService} from './user.service';

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
