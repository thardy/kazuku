import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {UserService} from "../../users/user.service";
import {UserContext} from "../../users/user-context.model";

@Component({
    selector: 'kz-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.less']
})
export class NavBarComponent implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();
    userContext: UserContext = new UserContext();
    navItems;

    constructor(private userService: UserService, private router: Router) {
    }

    ngOnInit() {
        this.navItems = this.getNavItems();
        this.userService.currentUserContext
            .takeUntil(this.ngUnsubscribe)
            .subscribe((userContext) => {
                this.userContext = userContext;

                // add extra navItems for metaOrg
                if (userContext.org.isMetaOrg) {
                    this.navItems.push({name: 'Orgs', destination: 'organizations'});
                }
            });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    logout() {
        this.userService.logout()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
                () => {
                    this.router.navigate(['login']);
                },
                (error) => {
                    this.router.navigate(['login']);
                }
            );
    }

    getNavItems() {
        let navItems = [];

        navItems.push({ name: 'Dashboard', destination: 'dashboard' });
        navItems.push({ name: 'Sites', destination: 'sites' });
        navItems.push({ name: 'Pages', destination: 'pages' });
        navItems.push({ name: 'Templates', destination: 'templates' });
        navItems.push({ name: 'Queries', destination: 'queries' });

        return navItems;
    }

}
