import {Component, OnInit} from '@angular/core';
import {Organization} from './organization.model';
import {OrganizationService} from './organization.service';
import {Router} from '@angular/router';
import {UserService} from '../users/user.service';
import {BaseComponent} from '../common/base-component';
import {UserContext} from '../users/user-context.model';

@Component({
  selector: 'kz-organization-list',
  templateUrl: './organization-list.component.html'
})
export class OrganizationListComponent extends BaseComponent implements OnInit {

    organizations: Organization[] = [];
    userContext: UserContext = new UserContext();

    constructor(private organizationService: OrganizationService, private userService: UserService, private router: Router) {
        super();
    }

    ngOnInit() {
        this.organizationService.getAll()
            .subscribe((organizations) => {
                this.organizations = organizations;
            });

        this.userService.currentUserContext
            .takeUntil(this.ngUnsubscribe)
            .subscribe((userContext) => {
                this.userContext = userContext;
            });
    }

    create() {
        this.router.navigateByUrl('organizations/create');
    }

    selectOrg(orgId: string) {
        this.userService.selectOrgContext(orgId);
    }
}
