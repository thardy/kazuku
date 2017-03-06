import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppRoutingModule} from "./app-routing.module";

import {AppComponent} from './app.component';
import {SitesComponent} from './sites/sites.component';
import {PagesComponent} from './pages/pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NavBarComponent} from './layout/nav-bar/nav-bar.component';
import { TemplatesComponent } from './templates/templates.component';
import { CustomSchemaComponent } from './custom-schema/custom-schema.component';
import { CustomSchemasComponent } from './custom-schemas/custom-schemas.component';
import { CustomDataComponent } from './custom-data/custom-data.component';
import { QueriesComponent } from './queries/queries.component';

@NgModule({
    declarations: [
        AppComponent,
        SitesComponent,
        PagesComponent,
        DashboardComponent,
        NavBarComponent,
        TemplatesComponent,
        CustomSchemaComponent,
        CustomSchemasComponent,
        CustomDataComponent,
        QueriesComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
