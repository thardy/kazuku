import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SiteListComponent} from './site-list.component';
import {SiteComponent} from './site.component';


const routes: Routes = [
    {
        path: '',
        component: SiteListComponent
    },
    {
        path: ':id',
        component: SiteComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SitesRoutingModule {
}
