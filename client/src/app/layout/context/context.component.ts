import {Component, OnInit} from '@angular/core';
import {UserService} from '../../users/user.service';
import {BaseComponent} from '../../common/base-component';
import {UserContext} from '../../users/user-context.model';
import {map, takeUntil, tap} from 'rxjs/operators';
import {faAtom} from '@fortawesome/free-solid-svg-icons';
import {Observable} from 'rxjs';

@Component({
    selector: 'kz-context',
    templateUrl: './context.component.html'
})
export class ContextComponent extends BaseComponent implements OnInit {
    userContext$: Observable<UserContext>;

    constructor(private userService: UserService) {
        super();
    }

    ngOnInit() {
        this.userContext$ = this.userService.currentUserContext
            .pipe(
                map(currentUser => {
                    const modifiedUser = {...currentUser, icon: faAtom};
                    return modifiedUser;
                })
            );
        this.userContext$.subscribe(res => console.log(res));
    }

}
