import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QueriesComponent} from './queries.component';
import {AuthGuardService} from "../common/auth/auth-guard.service";
import {QueryComponent} from "./query-details/query.component";

const routes: Routes = [
    {
        path: '',
        component: QueriesComponent,
        canActivate: [AuthGuardService],
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
