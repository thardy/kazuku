import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {SitesComponent} from "./sites/sites.component";
import {PagesComponent} from "./pages/pages.component";
import {TemplateListComponent} from "./templates/template-list.component";
import {TemplateDetailComponent} from "./templates/template-detail.component";

// This is where we setup our routes!
const APP_ROUTES: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'sites', component: SitesComponent},
    {path: 'pages', component: PagesComponent},
    {path: 'templates', component: TemplateListComponent},
    {path: 'templates/:id', component: TemplateDetailComponent},
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    // {path: '**', redirectTo: '/dashboard'},
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
