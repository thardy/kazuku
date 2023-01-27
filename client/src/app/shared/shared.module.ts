import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {AsyncButtonDirective} from '../common/ui/async-button.directive';
import {BootstrapModule} from './bootstrap.module';
import {NgxBootstrapIconsModule} from "ngx-bootstrap-icons";
import {PageHeaderComponent} from "./components/page-header/page-header.component";


@NgModule({
    declarations: [
        AsyncButtonDirective,
        PageHeaderComponent
    ],
    imports: [
        CommonModule,
        NgxDatatableModule,
        FontAwesomeModule,
        BootstrapModule,
        NgxBootstrapIconsModule
    ],
    exports: [
        AsyncButtonDirective,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        BootstrapModule,
        NgxBootstrapIconsModule,
        PageHeaderComponent
    ]
})
export class SharedModule {
    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas);
    }
}
