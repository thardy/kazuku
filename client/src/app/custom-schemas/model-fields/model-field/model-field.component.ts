import {Component, Input, OnInit} from '@angular/core';
import {FieldTypes, FieldTypesUI} from '../../../common/constants/field-types';
import {BaseComponent} from '../../../common/base-component';
import {FieldSettingsComponent} from './field-settings/field-settings.component';
import {FormControl, FormGroup} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
    selector: 'kz-model-field',
    templateUrl: './model-field.component.html',
    styleUrls: ['./model-field.component.less']
})
export class ModelFieldComponent extends BaseComponent implements OnInit {
    @Input() field: {
        type: string;
        description: string;
        fieldId: string;
    };
    @Input() modelForm: FormGroup;
    public fieldUI = FieldTypesUI;

    modelFieldSettings: BsModalRef;

    constructor(private modalService: BsModalService) {
        super();
    }

    ngOnInit() {
        // console.log(this.modelForm);
        // console.log(this.field);
    }

    openFieldSettings() {
        const initialState = {
            fieldTitle: this.field.description,
            fieldType: this.field.type,
            fieldUI: this.fieldUI[this.field.type],
            modelForm: this.modelForm
        };
        this.modelFieldSettings = this.modalService.show(FieldSettingsComponent, {initialState});
        this.modelFieldSettings.setClass('modal-lg');
    }

}
