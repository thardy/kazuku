import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {SiteListComponent} from "./sites/site-list.component";
import {SiteDetailComponent} from "./sites/site-detail.component";
import {PagesComponent} from "./pages/pages.component";
import {TemplateListComponent} from "./templates/template-list.component";
import {TemplateDetailComponent} from "./templates/template-detail.component";
import {OrganizationListComponent} from "./organizations/organization-list.component";
import {OrganizationDetailComponent} from "./organizations/organization-detail.component";
import {LoginComponent} from "./login/login.component";
import {SetupComponent} from "./setup/setup.component";
import {SetupGuardService} from "./setup/setup-guard.service";
import {AuthGuardService} from './common/auth/auth-guard.service';

// This is where we setup our routes!
const APP_ROUTES: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
    {path: 'organizations', component: OrganizationListComponent, canActivate: [AuthGuardService]},
    {path: 'organizations/:id', component: OrganizationDetailComponent, canActivate: [AuthGuardService]},
    {path: 'sites', component: SiteListComponent, canActivate: [AuthGuardService]},
    {path: 'sites/:id', component: SiteDetailComponent, canActivate: [AuthGuardService]},
    {path: 'pages', component: PagesComponent, canActivate: [AuthGuardService]},
    {path: 'setup', component: SetupComponent, canActivate: [SetupGuardService]},
    {path: 'templates', component: TemplateListComponent, canActivate: [AuthGuardService]},
    {path: 'templates/:id', component: TemplateDetailComponent, canActivate: [AuthGuardService]},
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
