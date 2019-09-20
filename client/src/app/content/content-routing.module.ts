import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContentDashboardComponent} from './container/content-dashboard/content-dashboard.component';
import {CustomContentListComponent} from './custom-content-list/custom-content-list.component';
import {ModelListComponent} from './content-models/model-list/model-list.component';
import {CreateModelComponent} from './content-models/create-model/create-model.component';
import {ModelDetailsComponent} from './content-models/model-details/model-details.component';
import {ContentModelDashboardComponent} from './content-models/content-model-dashboard.component';


const routes: Routes = [
    {
        path: '',
        component: ContentDashboardComponent
    },
    {
        path: 'list',
        component: CustomContentListComponent
    },
    {
        path: 'models',
        component: ContentModelDashboardComponent,
        children: [
            {
                path: '',
                component: ModelListComponent
            },
            {
                path: 'create',
                component: CreateModelComponent
            },
            {
                path: ':id',
                component: ModelDetailsComponent
            }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
