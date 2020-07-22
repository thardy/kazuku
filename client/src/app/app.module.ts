import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry} from 'ngx-schema-form';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavBarComponent} from './layout/nav-bar/nav-bar.component';
// import {TemplateListComponent} from './templates/template-list.component';
// import {TemplateComponent} from './templates/template.component';
import {CustomDataListComponent} from './custom-data/custom-data-list.component';
import {QueryListComponent} from './queries/query-list.component';
import {QueryComponent} from './queries/query.component';
// import {TemplateService} from './templates/template.service';
import {OrganizationService} from './organizations/shared/organization.service';
import {SiteService} from './sites/site.service';
import {LoginComponent} from './login/login.component';
import {UserListComponent} from './users/user-list.component';
import {QueryService} from './queries/query.service';
import {UserService} from './users/user.service';
import {SetupComponent} from './setup/setup.component';
import {SetupService} from './setup/setup.service';
import {SetupGuardService} from './setup/setup-guard.service';
import {AuthGuardService} from './common/auth/auth-guard.service';
import {CustomDataComponent} from './custom-data/custom-data.component';
import {CustomDataService} from './custom-data/custom-data.service';
import {UnAuthenticatedInterceptor} from './unauthenticated.interceptor';
import {HttpService} from './common/http.service';
import {ContextComponent} from './layout/context/context.component';
import {AutofocusDirective} from './common/ui/autofocus.directive';
import {BaseComponent} from './common/base-component';
import {WorkspaceActionsComponent} from './layout/workspace-actions/workspace-actions.component';
import {DashboardModule} from './dashboard/dashboard.module';
import {OrganizationsModule} from './organizations/organizations.module';
import {SitesModule} from './sites/sites.module';
import {PagesModule} from './pages/pages.module';
import {SharedModule} from './shared/shared.module';
import {SchemaModule} from './custom-schemas/schema.module';

@NgModule({
    declarations: [
        AppComponent,
        BaseComponent,
        NavBarComponent,
        CustomDataListComponent,
        QueryListComponent,
        QueryComponent,
        LoginComponent,
        UserListComponent,
        SetupComponent,
        CustomDataComponent,
        ContextComponent,
        AutofocusDirective,
        WorkspaceActionsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        SharedModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SchemaFormModule.forRoot(),
        DashboardModule,
        OrganizationsModule,
        SitesModule,
        PagesModule,
        SchemaModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS, useClass: UnAuthenticatedInterceptor, multi: true,
        },
        HttpService,
        OrganizationService,
        SiteService,
        QueryService,
        UserService,
        SetupService,
        SetupGuardService,
        AuthGuardService,
        CustomDataService,
        {provide: WidgetRegistry, useClass: DefaultWidgetRegistry}
    ],
    entryComponents: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
