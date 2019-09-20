import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrganizationsRoutingModule} from './organizations-routing.module';
import {OrganizationListComponent} from './organization-list.component';
import {SharedModule} from '../shared/shared.module';


@NgModule({
    declarations: [
        OrganizationListComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        OrganizationsRoutingModule
    ]
})
export class OrganizationsModule {
}
