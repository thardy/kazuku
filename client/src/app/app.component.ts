import {Component, OnInit} from '@angular/core';
import {AuthService} from './common/auth/auth.service';
import {Store} from '@ngrx/store';
import {LoadAuth} from './common/auth/store/actions/auth.actions';

@Component({
    selector: 'kz-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    isCollapsed = false;

    constructor(private authService: AuthService,
                private store: Store<any>) {
        // this.store.dispatch(new LoadAuth());
    }

    ngOnInit() {}

    logout() {
        this.authService.logout();
    }

}
