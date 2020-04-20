import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {TemplateListComponent} from './templates/template-list.component';
import {TemplateComponent} from './templates/template.component';
import {LoginComponent} from './login/login.component';
import {SetupComponent} from './setup/setup.component';
import {SetupGuardService} from './setup/setup-guard.service';
import {AuthGuardService} from './common/auth/auth-guard.service';
import {QueryListComponent} from './queries/query-list.component';
import {QueryComponent} from './queries/query.component';
import {CustomSchemaListComponent} from './custom-schemas/custom-schema-list.component';
import {CustomSchemaComponent} from './custom-schemas/custom-schema.component';
import {CustomDataListComponent} from 'app/custom-data/custom-data-list.component';
import {CustomDataComponent} from './custom-data/custom-data.component';

// This is where we setup our routes!
const APP_ROUTES: Routes = [
    {path: 'login', component: LoginComponent},
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'organizations',
        loadChildren: () => import('./organizations/organizations.module').then(mod => mod.OrganizationsModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'content-models',
        loadChildren: () => import('./custom-schemas/schema.module').then(mod => mod.SchemaModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'content',
        loadChildren: () => import('./content/content.module').then(mod => mod.ContentModule),
        canActivate: [AuthGuardService]
    },
    {path: 'content/create/:contentType', component: CustomDataComponent, canActivate: [AuthGuardService]},
    {path: 'content/:contentType/:id', component: CustomDataComponent, canActivate: [AuthGuardService]},
    {
        path: 'sites',
        loadChildren: () => import('./sites/sites.module').then(mod => mod.SitesModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module').then(mod => mod.PagesModule),
        canActivate: [AuthGuardService]
    },
    // {path: 'sites', component: SiteListComponent, canActivate: [AuthGuardService]},
    // {path: 'sites/create', component: SiteComponent, canActivate: [AuthGuardService]},
    // {path: 'sites/:id', component: SiteComponent, canActivate: [AuthGuardService]},
    // {path: 'pages', component: PageListComponent, canActivate: [AuthGuardService]},
    // {path: 'pages/create', component: PageComponent, canActivate: [AuthGuardService]},
    // {path: 'pages/:nameId', component: PageComponent, canActivate: [AuthGuardService]},
    {path: 'setup', component: SetupComponent, canActivate: [SetupGuardService]},
    {path: 'templates', component: TemplateListComponent, canActivate: [AuthGuardService]},
    {path: 'templates/create', component: TemplateComponent, canActivate: [AuthGuardService]},
    {path: 'templates/:nameId', component: TemplateComponent, canActivate: [AuthGuardService]},
    {path: 'queries', component: QueryListComponent, canActivate: [AuthGuardService]},
    {path: 'queries/create', component: QueryComponent, canActivate: [AuthGuardService]},
    {path: 'queries/:nameId', component: QueryComponent, canActivate: [AuthGuardService]},
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
