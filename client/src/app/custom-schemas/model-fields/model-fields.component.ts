import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BaseComponent} from '../../common/base-component';
import {FormGroup} from '@angular/forms';
import {FieldTypes} from '../../common/constants/field-types.constants';

@Component({
    selector: 'kz-model-fields',
    templateUrl: './model-fields.component.html',
    styleUrls: ['./model-fields.component.less']
})
export class ModelFieldsComponent extends BaseComponent implements OnInit, OnChanges {
    @Input() form: any;
    @Input() fields: FormGroup;
    public fieldTypes = FieldTypes;

    constructor() {
        super();
    }

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.fields);
        console.log(this.form);
    }

}
