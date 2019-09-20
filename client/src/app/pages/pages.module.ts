import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PagesRoutingModule} from './pages-routing.module';
import {PageListComponent} from './page-list.component';
import {PageComponent} from './page.component';
import {SharedModule} from '../shared/shared.module';
import {TemplateComponent} from '../templates/template.component';
import {TemplateListComponent} from '../templates/template-list.component';

@NgModule({
    declarations: [
        PageListComponent,
        PageComponent,
        TemplateListComponent,
        TemplateComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        PagesRoutingModule
    ]
})
export class PagesModule {
}
