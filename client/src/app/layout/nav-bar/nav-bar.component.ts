import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {UserService} from '../../users/user.service';
import {UserContext} from '../../users/user-context.model';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'kz-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.less']
})
export class NavBarComponent implements OnInit, OnDestroy {
    @Input() collapsedSidenav: boolean;

    private ngUnsubscribe: Subject<void> = new Subject<void>();
    userContext: UserContext = new UserContext();
    navItems;

    constructor(private userService: UserService, private router: Router) {
    }

    ngOnInit() {
        this.navItems = this.getNavItems();
        this.userService.currentUserContext
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((userContext) => {
                this.userContext = userContext;

                // add extra navItems for metaAdmin
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
        // this.userService.logout()
        //     .pipe(
        //         takeUntil(this.ngUnsubscribe)
        //     )
        //     .subscribe(
        //         () => {
        //             this.router.navigate(['login']);
        //         },
        //         (error) => {
        //             this.router.navigate(['login']);
        //         }
        //     );
        await this.userService.logout();
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
