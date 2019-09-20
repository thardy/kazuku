import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AsyncButtonDirective} from '../common/ui/async-button.directive';


@NgModule({
    declarations: [
        AsyncButtonDirective
    ],
    imports: [
        CommonModule,
        NgxDatatableModule,
        FontAwesomeModule
    ],
    exports: [
        AsyncButtonDirective,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class SharedModule {
}
