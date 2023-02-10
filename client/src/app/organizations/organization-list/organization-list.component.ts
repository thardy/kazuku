import {Component, OnInit} from '@angular/core';
import {Organization} from '../../common/auth/organization.model';
import {OrganizationService} from '../shared/organization.service';
import {Router} from '@angular/router';
import {AuthService} from '../../common/auth/auth.service';
import {BaseComponent} from '../../common/base-component';
import {IUserContext} from '../../common/auth/user-context.model';
import {startWith, takeUntil} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthActions, AuthSelectors} from '../../common/auth/store';
import {Store} from '@ngrx/store';

@Component({
    selector: 'kz-organization-list',
    templateUrl: './organization-list.component.html'
})
export class OrganizationListComponent extends BaseComponent implements OnInit {
    organizations$: Observable<Organization[]> = this.organizationService.getAll();
    userContext$: Observable<IUserContext> = this.store.select(AuthSelectors.selectUserContext);

    public showHelp = false;

    constructor(private organizationService: OrganizationService,
                private store: Store,
                private router: Router) {
        super();
    }

    ngOnInit() {
    }

    create() {
        this.router.navigateByUrl('organizations/create');
    }

    selectOrg(orgId: string) {
        this.store.dispatch(AuthActions.selectOrgButtonClicked({ orgId }));
    }
}
