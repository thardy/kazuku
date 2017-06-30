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

// This is where we setup our routes!
const APP_ROUTES: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'organizations', component: OrganizationListComponent},
    {path: 'organizations/:id', component: OrganizationDetailComponent},
    {path: 'sites', component: SiteListComponent},
    {path: 'sites/:id', component: SiteDetailComponent},
    {path: 'pages', component: PagesComponent},
    {path: 'templates', component: TemplateListComponent},
    {path: 'templates/:id', component: TemplateDetailComponent},
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
