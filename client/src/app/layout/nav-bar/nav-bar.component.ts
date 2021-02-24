import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {AuthService} from '../../common/auth/auth.service';
import {UserContext} from '../../common/auth/user-context.model';
import {filter, takeUntil} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import * as authSelectors from '../../common/auth/store/selectors';

@Component({
    selector: 'kz-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.less']
})
export class NavBarComponent implements OnInit, OnDestroy {
    userContext$: Observable<UserContext> = this.store.pipe(select(authSelectors.getAuthorizedUserContext));
    @Input() collapsedSidenav: boolean;

    private ngUnsubscribe: Subject<void> = new Subject<void>();
    navItems;

    constructor(private authService: AuthService,
                private store: Store<any>,
                private router: Router) {
    }

    ngOnInit() {
        this.navItems = this.getNavItems();

        this.userContext$.pipe(
            filter((userContext: UserContext) => userContext !== undefined)
        ).subscribe((userContext: UserContext) => {
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
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    async logout() {
        await this.authService.logout();
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
