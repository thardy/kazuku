import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomSchemaListComponent} from './custom-schema-list.component';
import {KazukuAuthGuardService} from '@common/auth/kazuku-auth-guard.service';
import {CustomSchemaComponent} from './custom-schema.component';

const routes: Routes = [
    {
        path: '',
        component: CustomSchemaListComponent,
        canActivate: [KazukuAuthGuardService],
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
