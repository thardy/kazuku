import {Component, OnInit} from '@angular/core';
import {UserService} from '../../users/user.service';
import {BaseComponent} from '../../common/base-component';
import {UserContext} from '../../users/user-context.model';

@Component({
    selector: 'kz-context',
    templateUrl: './context.component.html'
})
export class ContextComponent extends BaseComponent implements OnInit {

    userContext: UserContext = new UserContext();

    constructor(private userService: UserService) {
        super();
    }

    ngOnInit() {
        this.userService.currentUserContext
            .takeUntil(this.ngUnsubscribe)
            .subscribe((userContext) => {
                this.userContext = userContext;
            });
    }

}
