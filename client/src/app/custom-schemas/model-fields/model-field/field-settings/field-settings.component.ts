import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../common/base-component';
import {BsModalRef, TabsetComponent} from 'ngx-bootstrap';
import {FieldTypes} from '../../../../common/constants/field-types';
import {BasicFieldSettingsComponent} from './basic-field-settings/basic-field-settings.component';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'kz-field-settings',
    templateUrl: './field-settings.component.html',
    styleUrls: ['./field-settings.component.less']
})
export class FieldSettingsComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('fieldSettingsTabs', {static: false}) fieldSettingsTabs: TabsetComponent;
    @ViewChild('basicFieldSettings', {static: false}) basicFieldSettings: BasicFieldSettingsComponent;
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
