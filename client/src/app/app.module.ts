import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry} from 'ngx-schema-form';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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
import {CustomSchemaComponent} from './custom-schemas/custom-schema.component';
import {CustomSchemaService} from './custom-schemas/custom-schema.service';
import {FieldBuilderComponent} from './custom-schemas/field-builder.component';
import {CustomDataComponent} from './custom-data/custom-data.component';
import {CustomDataService} from './custom-data/custom-data.service';
import {UnAuthenticatedInterceptor} from './unauthenticated.interceptor';
import {HttpService} from './common/http.service';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { SchedulesComponent } from './schedules/schedule.component';
import {ScheduleService} from './schedules/schedule.service';
import { ContextComponent } from './layout/context/context.component';
import {AutofocusDirective} from './common/ui/autofocus.directive';
import {BaseComponent} from './common/base-component';
import { WorkspaceActionsComponent } from './layout/workspace-actions/workspace-actions.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [
        AppComponent,
        BaseComponent,
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
        CustomDataComponent,
        SchedulesComponent,
        ContextComponent,
        AutofocusDirective,
        WorkspaceActionsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SchemaFormModule.forRoot(),
        NgxDatatableModule,
        FontAwesomeModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS, useClass: UnAuthenticatedInterceptor, multi: true,
        },
        HttpService,
        OrganizationService,
        CustomSchemaService,
        SiteService,
        TemplateService,
        QueryService,
        UserService,
        SetupService,
        SetupGuardService,
        AuthGuardService,
        CustomDataService,
        ScheduleService,
        {provide: WidgetRegistry, useClass: DefaultWidgetRegistry}
    ],
    entryComponents: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
