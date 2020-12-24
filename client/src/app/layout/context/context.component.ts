import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../common/auth/auth.service';
import {BaseComponent} from '../../common/base-component';
import {UserContext} from '../../common/auth/user-context.model';
import {map, takeUntil, tap} from 'rxjs/operators';
import {faAtom} from '@fortawesome/free-solid-svg-icons';
import {Observable} from 'rxjs';

@Component({
    selector: 'kz-context',
    templateUrl: './context.component.html'
})
export class ContextComponent extends BaseComponent implements OnInit {
    userContext$: Observable<UserContext>;

    constructor(private userService: AuthService) {
        super();
    }

    ngOnInit() {
        this.userContext$ = this.userService.userContext$
            .pipe(
                map(currentUser => {
                    const modifiedUser = {...currentUser, icon: faAtom};
                    return modifiedUser;
                })
            );
        this.userContext$.subscribe(res => console.log(res));
    }

}
