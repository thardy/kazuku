import {Component, OnInit} from '@angular/core';
import {Organization} from '../../common/auth/organization.model';
import {OrganizationService} from '../shared/organization.service';
import {Router} from '@angular/router';
import {AuthService} from '../../common/auth/auth.service';
import {BaseComponent} from '../../common/base-component';
import {UserContext} from '../../common/auth/user-context.model';
import {startWith, takeUntil} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
    selector: 'kz-organization-list',
    templateUrl: './organization-list.component.html'
})
export class OrganizationListComponent extends BaseComponent implements OnInit {
    organizations$: Observable<Organization[]> = this.organizationService.getAll();
    userContext$: Observable<UserContext> = this.userService.userContext$;

    public showHelp = false;

    constructor(private organizationService: OrganizationService,
                private userService: AuthService,
                private router: Router) {
        super();
        this.userContext$.pipe(
            startWith(new UserContext())
        );
    }

    ngOnInit() {
    }

    create() {
        this.router.navigateByUrl('organizations/create');
    }

    selectOrg(orgId: string) {
        this.userService.selectOrgContext(orgId);
    }
}
