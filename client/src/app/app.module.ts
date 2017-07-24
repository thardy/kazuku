import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {AppRoutingModule} from "./app-routing.module";

import {AppComponent} from './app.component';
import {OrganizationListComponent} from './organizations/organization-list.component';
import {OrganizationDetailComponent} from './organizations/organization-detail.component';
import {SiteListComponent} from './sites/site-list.component';
import {SiteDetailComponent} from './sites/site-detail.component';
import {PagesComponent} from './pages/pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NavBarComponent} from './layout/nav-bar/nav-bar.component';
import {TemplateListComponent} from './templates/template-list.component';
import {TemplateDetailComponent} from './templates/template-detail.component';
import {CustomSchemasComponent} from './custom-schemas/custom-schemas.component';
import {CustomDataComponent} from './custom-data/custom-data.component';
import {QueriesComponent} from './queries/queries.component';
import {InMemoryDataService} from "./in-memory-data.service";
import {TemplateService} from "./templates/template.service";
import {OrganizationService} from "./organizations/organization.service";
import {SiteService} from "./sites/sites.service";
import {LoginComponent} from './login/login.component';
import {UsersComponent} from './users/users.component';
import {QueryService} from "./queries/query.service";
import {UserService} from "./users/user.service";
import { SetupComponent } from './setup/setup.component';
import {SetupService} from "./setup/setup.service";

@NgModule({
    declarations: [
        AppComponent,
        OrganizationListComponent,
        OrganizationDetailComponent,
        SiteListComponent,
        SiteDetailComponent,
        PagesComponent,
        DashboardComponent,
        NavBarComponent,
        TemplateListComponent,
        TemplateDetailComponent,
        CustomSchemasComponent,
        CustomDataComponent,
        QueriesComponent,
        LoginComponent,
        UsersComponent,
        SetupComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService, {apiBase: 'api/', passThruUnknownUrl: true})
    ],
    providers: [
        OrganizationService,
        SiteService,
        TemplateService,
        QueryService,
        UserService,
        SetupService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
