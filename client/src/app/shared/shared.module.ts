import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {AsyncButtonDirective} from '../common/ui/async-button.directive';
import {BootstrapModule} from './bootstrap.module';


@NgModule({
    declarations: [
        AsyncButtonDirective
    ],
    imports: [
        CommonModule,
        NgxDatatableModule,
        FontAwesomeModule,
        BootstrapModule,
    ],
    exports: [
        AsyncButtonDirective,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        BootstrapModule,
    ]
})
export class SharedModule {
    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas);
    }
}
