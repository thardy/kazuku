import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {SitesRoutingModule} from './sites-routing.module';
import {SiteListComponent} from './site-list.component';
import {SiteComponent} from './site.component';
import {SharedModule} from '../shared/shared.module';
import {SchedulesComponent} from '../schedules/schedule.component';
import {SiteEditComponent} from './site-edit.component';
import {SiteEffects, siteReducer, sitesFeatureKey} from './store';

@NgModule({
    declarations: [
        SiteListComponent,
        SiteComponent,
        SiteEditComponent,
        SchedulesComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        SitesRoutingModule,
        StoreModule.forFeature(sitesFeatureKey, siteReducer, { }),
        EffectsModule.forFeature([SiteEffects]),
    ]
})
export class SitesModule {
}
