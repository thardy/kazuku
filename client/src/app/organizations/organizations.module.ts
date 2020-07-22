import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrganizationsRoutingModule} from './organizations-routing.module';
import {OrganizationListComponent} from './organization-list/organization-list.component';
import {SharedModule} from '../shared/shared.module';
import {OrganizationComponent} from './organization/organization.component';

@NgModule({
    declarations: [
        OrganizationListComponent,
        OrganizationComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        OrganizationsRoutingModule
    ]
})
export class OrganizationsModule {
}
