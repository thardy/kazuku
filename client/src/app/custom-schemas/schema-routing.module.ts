import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomSchemaListComponent} from './custom-schema-list.component';
import {AuthGuardService} from '../common/auth/auth-guard.service';
import {CustomSchemaComponent} from './custom-schema.component';

const routes: Routes = [
    {
        path: '',
        component: CustomSchemaListComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: 'create',
                component: CustomSchemaComponent,
            },
            {
                path: ':contentType',
                component: CustomSchemaComponent,
            },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchemaRoutingModule {
}
