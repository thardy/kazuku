import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {SetupComponent} from './setup/setup.component';
import {SetupGuardService} from './setup/setup-guard.service';
import {KazukuAuthGuardService} from './common/auth/kazuku-auth-guard.service';
import {IconNamesEnum} from "ngx-bootstrap-icons";
import {faGauge} from "@fortawesome/free-solid-svg-icons/faGauge";
import {faPlaneDeparture} from "@fortawesome/free-solid-svg-icons/faPlaneDeparture";
import {faSitemap} from "@fortawesome/free-solid-svg-icons/faSitemap";
import {faFolder} from "@fortawesome/free-solid-svg-icons/faFolder";
import {faDatabase} from "@fortawesome/free-solid-svg-icons/faDatabase";

const iconNames = IconNamesEnum;

/** This is where we setup our routes! **/
const APP_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: {
            includeInSidebar: false
        }
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule),
        canActivate: [KazukuAuthGuardService],
        data: {
            includeInSidebar: true,
            routeLabel: 'Dashboard',
            routeIcon: faGauge
        }
    },
    {
        path: 'organizations',
        loadChildren: () => import('./organizations/organizations.module').then(mod => mod.OrganizationsModule),
        canActivate: [KazukuAuthGuardService],
        data: {
            includeInSidebar: false,
        }
    },
    {
        path: 'content-models',
        loadChildren: () => import('./custom-schemas/schema.module').then(mod => mod.SchemaModule),
        canActivate: [KazukuAuthGuardService],
        data: {
            includeInSidebar: true,
            routeLabel: 'Models',
            routeIcon: faPlaneDeparture
        }
    },
    {
        path: 'content',
        loadChildren: () => import('./content/content.module').then(mod => mod.ContentModule),
        data: {
            includeInSidebar: true,
            routeLabel: 'Content',
            routeIcon: faGauge
        }
    },
    {
        path: 'sites',
        loadChildren: () => import('./sites/sites.module').then(mod => mod.SitesModule),
        canActivate: [KazukuAuthGuardService],
        data: {
            includeInSidebar: true,
            routeLabel: 'Sites',
            routeIcon: faSitemap
        }
    },
    {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module').then(mod => mod.PagesModule),
        canActivate: [KazukuAuthGuardService],
        data: {
            includeInSidebar: true,
            routeLabel: 'Pages',
            routeIcon: faFolder
        }
    },
    {
        path: 'setup',
        component: SetupComponent,
        canActivate: [SetupGuardService],
        data: {
            includeInSidebar: false
        }
    },
    {
        path: 'templates',
        loadChildren: () => import('./templates/templates.module').then(m => m.TemplatesModule),
        data: {
            includeInSidebar: true,
            routeLabel: 'Templates',
            routeIcon: faGauge
        }
    },
    {
        path: 'queries',
        loadChildren: () => import('./queries/queries.module').then(m => m.QueriesModule),
        data: {
            includeInSidebar: true,
            routeLabel: 'Queries',
            routeIcon: faDatabase
        }
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES, { useHash: true, relativeLinkResolution: 'legacy', onSameUrlNavigation: 'reload' })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
