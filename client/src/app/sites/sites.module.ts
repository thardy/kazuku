import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SitesRoutingModule} from './sites-routing.module';
import {SiteListComponent} from './site-list.component';
import {SiteComponent} from './site.component';
import {SharedModule} from '../shared/shared.module';
import {SchedulesComponent} from '../schedules/schedule.component';


@NgModule({
    declarations: [
        SiteListComponent,
        SiteComponent,
        SchedulesComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        SitesRoutingModule
    ]
})
export class SitesModule {
}
