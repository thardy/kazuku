import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {AppRoutingModule} from "./app-routing.module";

import {AppComponent} from './app.component';
import {SitesComponent} from './sites/sites.component';
import {PagesComponent} from './pages/pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NavBarComponent} from './layout/nav-bar/nav-bar.component';
import {TemplateListComponent} from './templates/template-list.component';
import {CustomSchemasComponent} from './custom-schemas/custom-schemas.component';
import {CustomDataComponent} from './custom-data/custom-data.component';
import {QueriesComponent} from './queries/queries.component';
import {InMemoryDataService} from "./in-memory-data.service";
import { TemplateDetailComponent } from './templates/template-detail.component';
import {TemplateService} from "./templates/template.service";

@NgModule({
    declarations: [
        AppComponent,
        SitesComponent,
        PagesComponent,
        DashboardComponent,
        NavBarComponent,
        TemplateListComponent,
        CustomSchemasComponent,
        CustomDataComponent,
        QueriesComponent,
        TemplateDetailComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService, {apiBase: 'api/', passThruUnknownUrl: true})
    ],
    providers: [
        TemplateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
