import {Component, OnInit} from '@angular/core';
import {AuthService} from '@common/auth/auth.service';
import {BaseComponent} from '@common/base-component';
import {IUserContext} from '@common/auth/user-context.model';
import {map, takeUntil, tap} from 'rxjs/operators';
import {faAtom} from '@fortawesome/free-solid-svg-icons';
import {Observable} from 'rxjs';
import {AuthSelectors} from '@common/auth/store';
import {Store} from '@ngrx/store';

@Component({
    selector: 'kz-context',
    templateUrl: './context.component.html'
})
export class ContextComponent extends BaseComponent implements OnInit {
    userContext$: Observable<IUserContext> = this.store.select(AuthSelectors.selectUserContext);

    constructor(private store: Store) {
        super();
    }

    ngOnInit() {
        // I couldn't figure out what was supposed to be happening here, so I just commented it all out (Tim)
        // this.userContext$
        //     .pipe(
        //         map(userContext => {
        //             const modifiedUser = {...userContext, icon: faAtom};
        //             return modifiedUser;
        //         })
        //     );
        // this.userContext$.subscribe(res => console.log(res));
    }

}
