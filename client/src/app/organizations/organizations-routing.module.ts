import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrganizationListComponent} from './organization-list.component';
import {OrganizationComponent} from './organization.component';
import {AuthGuardService} from '../common/auth/auth-guard.service';


const routes: Routes = [
    {
        path: '',
        component: OrganizationListComponent
    },
    // {path: 'organizations', component: OrganizationListComponent, canActivate: [AuthGuardService]},
    {
        path: 'organizations/create',
        component: OrganizationComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'organizations/:id',
        component: OrganizationComponent,
        canActivate: [AuthGuardService]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationsRoutingModule { }
