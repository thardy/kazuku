import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OrganizationListComponent} from './organization-list/organization-list.component';
import {OrganizationComponent} from './organization/organization.component';
import {AuthGuardService} from '../common/auth/auth-guard.service';

const routes: Routes = [
    {
        path: '',
        component: OrganizationListComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: 'create',
                component: OrganizationComponent,
            },
            {
                path: ':id',
                component: OrganizationComponent,
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationsRoutingModule {
}
