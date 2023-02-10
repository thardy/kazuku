import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {IUserContext} from '../../common/auth/user-context.model';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AuthActions, AuthSelectors} from '../../common/auth/store';

@Component({
    selector: 'kz-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.less']
})
export class NavBarComponent implements OnInit, OnDestroy {
    userContext$: Observable<IUserContext> = this.store.select(AuthSelectors.selectUserContext);
    @Input() collapsedSidenav: boolean;

    private ngUnsubscribe: Subject<void> = new Subject<void>();
    navItems;

    constructor(private store: Store<any>,
                private router: Router) {
    }

    ngOnInit() {
        this.navItems = this.getNavItems();

        this.userContext$.pipe(
            filter((userContext: IUserContext) => userContext.user !== null),
            tap((userContext: IUserContext) => {
                const orgsIndex = this.navItems.findIndex((item) => item.name === 'Orgs');
                if (userContext.user.isMetaAdmin) {
                    // authorized to see organization admin
                    if (orgsIndex === -1) {
                        // not found so add it
                        this.navItems.push({name: 'Orgs', destination: 'organizations', icon: 'appstore'});
                    }
                } else if (orgsIndex !== -1) {
                    // found but doesn't belong, so remove it
                    this.navItems.splice(orgsIndex, 1);
                }
            }),
            takeUntil(this.ngUnsubscribe)
        ).subscribe();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    logout() {
        this.store.dispatch(AuthActions.logoutButtonClicked());
    }

    getNavItems() {
        const navItems = [
            {
                name: 'Dashboard',
                destination: 'dashboard',
                icon: 'dashboard'
            },
            {
                name: 'Content',
                destination: 'content/list',
                icon: 'build'
            },
            // {name: 'Content Model', destination: 'content/models'},
            {
                name: 'Content Model',
                destination: 'content-models',
                icon: 'database'
            },
            {
                name: 'Sites',
                destination: 'sites',
                icon: 'layout'
            },
            {
                name: 'Pages',
                destination: 'pages',
                icon: 'file'
            },
            {
                name: 'Templates',
                destination: 'templates',
                icon: 'snippets'
            },
            {
                name: 'Queries',
                destination: 'queries',
                icon: 'question-circle'
            }
        ];
        return navItems;
    }

}
