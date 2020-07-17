import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

const FIELD_TYPES = ['string', 'number', 'date'];

@Component({
    selector: 'kz-basic-field-settings',
    templateUrl: './basic-field-settings.component.html',
    styleUrls: ['./basic-field-settings.component.less']
})
export class BasicFieldSettingsComponent implements OnInit {
    fieldTypes = FIELD_TYPES;

    public basicFieldSettingsForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        contentType: new FormControl(''),
    });

    constructor() {
    }

    ngOnInit() {
    }

}
