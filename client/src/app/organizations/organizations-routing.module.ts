import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OrganizationListComponent} from './organization-list/organization-list.component';
import {OrganizationComponent} from './organization/organization.component';
import {KazukuAuthGuardService} from '@common/auth/kazuku-auth-guard.service';

const routes: Routes = [
    {
        path: '',
        component: OrganizationListComponent,
        canActivate: [KazukuAuthGuardService],
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
