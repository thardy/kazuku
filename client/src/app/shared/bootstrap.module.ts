import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {BsDropdownModule} from 'ngx-bootstrap';
import {ModalModule} from 'ngx-bootstrap';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        ModalModule.forRoot()
    ],
    exports: [
        TabsModule,
        BsDropdownModule,
        ModalModule
    ]
})
export class BootstrapModule {
}
