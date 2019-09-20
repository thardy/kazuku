import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PageListComponent} from './page-list.component';


const routes: Routes = [
    {
        path: '',
        component: PageListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
