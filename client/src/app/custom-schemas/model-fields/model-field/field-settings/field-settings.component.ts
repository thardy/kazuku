import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '@common/base-component';
import {FieldTypes} from '@common/constants/field-types.constants';
import {BasicFieldSettingsComponent} from './basic-field-settings/basic-field-settings.component';
import {FormGroup} from '@angular/forms';
import {TabsetComponent} from 'ngx-bootstrap/tabs';
import {BsModalRef} from 'ngx-bootstrap/modal';

@Component({
    selector: 'kz-field-settings',
    templateUrl: './field-settings.component.html',
    styleUrls: ['./field-settings.component.less']
})
export class FieldSettingsComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('fieldSettingsTabs') fieldSettingsTabs: TabsetComponent;
    @ViewChild('basicFieldSettings') basicFieldSettings: BasicFieldSettingsComponent;
    fieldTitle: string;
    fieldType: FieldTypes;
    fieldUI: any;
    modelForm: FormGroup;

    constructor(public bsModalRef: BsModalRef) {
        super();
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.setBasicSettings();
    }

    setBasicSettings() {
        this.basicFieldSettings.basicFieldSettingsForm.patchValue({
            name: this.fieldTitle,
            contentType: this.fieldType
        });
    }

    selectTab(tabId: number) {
        this.fieldSettingsTabs.tabs[tabId].active = true;
    }

}
