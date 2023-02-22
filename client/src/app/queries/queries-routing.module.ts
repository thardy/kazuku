import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QueriesComponent} from './queries.component';
import {KazukuAuthGuardService} from "@common/auth/kazuku-auth-guard.service";
import {QueryComponent} from "./query-details/query.component";

const routes: Routes = [
    {
        path: '',
        component: QueriesComponent,
        canActivate: [KazukuAuthGuardService],
        children: [
            {
                path: 'create',
                component: QueryComponent,
            },
            {
                path: ':nameId',
                component: QueryComponent,
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QueriesRoutingModule {
}
