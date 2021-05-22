import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

/** config angular i18n **/
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
//import {en_US, NgZorroAntdModule, NZ_I18N} from 'ng-zorro-antd';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';

registerLocaleData(en);

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        NzFormModule,
        NzLayoutModule,
        NzListModule,
        NzInputModule,
        NzButtonModule,
        NzPageHeaderModule,
        NzMenuModule,
        NzIconModule,
        NzAvatarModule,
    ],
    exports: [
        NzFormModule,
        NzLayoutModule,
        NzListModule,
        NzInputModule,
        NzButtonModule,
        NzPageHeaderModule,
        NzMenuModule,
        NzIconModule,
        NzAvatarModule
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
