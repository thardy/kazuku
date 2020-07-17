import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

/** config angular i18n **/
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {en_US, NgZorroAntdModule, NZ_I18N} from 'ng-zorro-antd';

registerLocaleData(en);

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        NgZorroAntdModule
    ],
    exports: [
        NgZorroAntdModule
    ],
    providers: [
        {
            provide: NZ_I18N,
            useValue: en_US
        }
    ]
})
export class AntdModule {
}
