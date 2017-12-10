import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {SiteListComponent} from "./sites/site-list.component";
import {SiteComponent} from "./sites/site.component";
import {PageListComponent} from "./pages/page-list.component";
import {TemplateListComponent} from "./templates/template-list.component";
import {TemplateComponent} from "./templates/template.component";
import {OrganizationListComponent} from "./organizations/organization-list.component";
import {OrganizationComponent} from "./organizations/organization.component";
import {LoginComponent} from "./login/login.component";
import {SetupComponent} from "./setup/setup.component";
import {SetupGuardService} from "./setup/setup-guard.service";
import {AuthGuardService} from './common/auth/auth-guard.service';
import {PageComponent} from "./pages/page.component";
import {QueryListComponent} from "./queries/query-list.component";
import {QueryComponent} from "./queries/query.component";
import {CustomSchemaListComponent} from "./custom-schemas/custom-schema-list.component";
import {CustomSchemaComponent} from "./custom-schemas/custom-schema.component";
import {CustomDataListComponent} from "app/custom-data/custom-data-list.component";
import {CustomDataComponent} from "./custom-data/custom-data.component";

// This is where we setup our routes!
const APP_ROUTES: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
    {path: 'organizations', component: OrganizationListComponent, canActivate: [AuthGuardService]},
    {path: 'organizations/create', component: OrganizationComponent, canActivate: [AuthGuardService]},
    {path: 'organizations/:id', component: OrganizationComponent, canActivate: [AuthGuardService]},
    {path: 'content-models', component: CustomSchemaListComponent, canActivate: [AuthGuardService]},
    {path: 'content-models/create', component: CustomSchemaComponent, canActivate: [AuthGuardService]},
    {path: 'content-models/:contentType', component: CustomSchemaComponent, canActivate: [AuthGuardService]},
    {path: 'content', component: CustomDataListComponent, canActivate: [AuthGuardService]},
    {path: 'content/create/:contentType', component: CustomDataComponent, canActivate: [AuthGuardService]},
    {path: 'content/:contentType/:id', component: CustomDataComponent, canActivate: [AuthGuardService]},
    {path: 'sites', component: SiteListComponent, canActivate: [AuthGuardService]},
    {path: 'sites/create', component: SiteComponent, canActivate: [AuthGuardService]},
    {path: 'sites/:id', component: SiteComponent, canActivate: [AuthGuardService]},
    {path: 'pages', component: PageListComponent, canActivate: [AuthGuardService]},
    {path: 'pages/create', component: PageComponent, canActivate: [AuthGuardService]},
    {path: 'pages/:id', component: PageComponent, canActivate: [AuthGuardService]},
    {path: 'setup', component: SetupComponent, canActivate: [SetupGuardService]},
    {path: 'templates', component: TemplateListComponent, canActivate: [AuthGuardService]},
    {path: 'templates/create', component: TemplateComponent, canActivate: [AuthGuardService]},
    {path: 'templates/:id', component: TemplateComponent, canActivate: [AuthGuardService]},
    {path: 'queries', component: QueryListComponent, canActivate: [AuthGuardService]},
    {path: 'queries/create', component: QueryComponent, canActivate: [AuthGuardService]},
    {path: 'queries/:id', component: QueryComponent, canActivate: [AuthGuardService]},
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
];

@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES, {useHash: true})
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
