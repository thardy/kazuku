import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TemplatesComponent} from './templates.component';
import {KazukuAuthGuardService} from "../common/auth/kazuku-auth-guard.service";
import {TemplateComponent} from "./template-details/template.component";

const routes: Routes = [
    {
        path: '',
        component: TemplatesComponent,
        canActivate: [KazukuAuthGuardService],
        children: [
            {
                path: 'create',
                component: TemplateComponent,
            },
            {
                path: ':nameId',
                component: TemplateComponent,
            },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesRoutingModule { }
