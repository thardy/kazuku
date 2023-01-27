import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContentDashboardComponent} from './container/content-dashboard/content-dashboard.component';
import {AuthGuardService} from "../common/auth/auth-guard.service";
import {CustomDataComponent} from "../custom-data/custom-data.component";


const routes: Routes = [
    {
        path: '',
        component: ContentDashboardComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: 'create/:contentType',
                component: CustomDataComponent,
            },
            {
                path: ':contentType/:id',
                component: CustomDataComponent,
            },
        ]
    },
    // {
    //     path: 'list',
    //     component: CustomContentListComponent
    // },
    // {
    //     path: 'models',
    //     component: ContentModelDashboardComponent,
    //     children: [
    //         {
    //             path: '',
    //             component: ModelListComponent
    //         },
    //         {
    //             path: 'create',
    //             component: CreateModelComponent
    //         },
    //         {
    //             path: ':contentType',
    //             component: ModelDetailsComponent
    //         }
    //     ]
    // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
