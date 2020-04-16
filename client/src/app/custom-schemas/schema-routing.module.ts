import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomSchemaListComponent} from './custom-schema-list.component';
import {AuthGuardService} from '../common/auth/auth-guard.service';
import {CustomSchemaComponent} from './custom-schema.component';

const routes: Routes = [
    {
        path: '',
        component: CustomSchemaListComponent
    },
    {
        path: 'content-models',
        component: CustomSchemaListComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'content-models/create',
        component: CustomSchemaComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'content-models/:contentType',
        component: CustomSchemaComponent,
        canActivate: [AuthGuardService]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchemaRoutingModule {
}
