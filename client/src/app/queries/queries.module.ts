import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QueriesRoutingModule} from './queries-routing.module';
import {QueriesComponent} from './queries.component';
import {SharedModule} from "../shared/shared.module";


@NgModule({
    declarations: [
        QueriesComponent
    ],
    imports: [
        CommonModule,
        QueriesRoutingModule,
        SharedModule
    ]
})
export class QueriesModule {
}
