import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ContentRoutingModule} from './content-routing.module';
import {ContentDashboardComponent} from './container/content-dashboard/content-dashboard.component';
import {CustomContentListComponent} from './custom-content-list/custom-content-list.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ModelListComponent} from './content-models/model-list/model-list.component';
import {CreateModelComponent} from './content-models/create-model/create-model.component';
import {ModelDetailsComponent} from './content-models/model-details/model-details.component';
import {ContentModelDashboardComponent} from './content-models/content-model-dashboard.component';
import {SharedModule} from '../shared/shared.module';


@NgModule({
    declarations: [ContentDashboardComponent, CustomContentListComponent, ModelListComponent, CreateModelComponent, ModelDetailsComponent, ContentModelDashboardComponent],
    imports: [
        CommonModule,
        ContentRoutingModule,
        SharedModule,
        NgxDatatableModule
    ]
})
export class ContentModule {
}
