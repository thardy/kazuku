import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {OrganizationListComponent} from './organizations/organization-list.component';
import {OrganizationComponent} from './organizations/organization.component';
import {SiteListComponent} from './sites/site-list.component';
import {SiteComponent} from './sites/site.component';
import {PageListComponent} from './pages/page-list.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NavBarComponent} from './layout/nav-bar/nav-bar.component';
import {TemplateListComponent} from './templates/template-list.component';
import {TemplateComponent} from './templates/template.component';
import {CustomSchemaListComponent} from './custom-schemas/custom-schema-list.component';
import {CustomDataListComponent} from './custom-data/custom-data-list.component';
import {QueryListComponent} from './queries/query-list.component';
import {QueryComponent} from './queries/query.component';
import {InMemoryDataService} from './in-memory-data.service';
import {TemplateService} from './templates/template.service';
import {OrganizationService} from './organizations/organization.service';
import {SiteService} from './sites/site.service';
import {LoginComponent} from './login/login.component';
import {UserListComponent} from './users/user-list.component';
import {QueryService} from './queries/query.service';
import {UserService} from './users/user.service';
import {SetupComponent} from './setup/setup.component';
import {SetupService} from './setup/setup.service';
import {SetupGuardService} from './setup/setup-guard.service';
import {AuthGuardService} from './common/auth/auth-guard.service';
import {AsyncButtonDirective} from './common/ui/async-button.directive';
import {PageComponent} from './pages/page.component';
import {SuiModule} from 'ng2-semantic-ui';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModalComponent} from './common/modal/modal.component';
import {CustomSchemaComponent} from './custom-schemas/custom-schema.component';
import {CustomSchemaService} from './custom-schemas/custom-schema.service';
import {FieldBuilderComponent} from './custom-schemas/field-builder.component';

@NgModule({
    declarations: [
        AppComponent,
        OrganizationListComponent,
        OrganizationComponent,
        SiteListComponent,
        SiteComponent,
        PageListComponent,
        PageComponent,
        DashboardComponent,
        NavBarComponent,
        TemplateListComponent,
        TemplateComponent,
        CustomSchemaListComponent,
        CustomSchemaComponent,
        FieldBuilderComponent,
        CustomDataListComponent,
        QueryListComponent,
        QueryComponent,
        LoginComponent,
        UserListComponent,
        SetupComponent,
        AsyncButtonDirective,
        ModalComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService, {apiBase: 'api/', passThruUnknownUrl: true}),
        SuiModule
    ],
    providers: [
        OrganizationService,
        CustomSchemaService,
        SiteService,
        TemplateService,
        QueryService,
        UserService,
        SetupService,
        SetupGuardService,
        AuthGuardService
    ],
    entryComponents: [
        ModalComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
