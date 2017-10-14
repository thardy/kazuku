import {Component, OnInit, Input} from '@angular/core';
import {BaseComponent} from "../common/base-component";
import {FormGroup} from '@angular/forms';
import 'rxjs/add/operator/mergemap';

const FIELD_TYPES = ["string", "number"];

@Component({
    selector: 'kz-field-builder',
    templateUrl: './field-builder.component.html'
})
export class FieldBuilderComponent extends BaseComponent implements OnInit {
    @Input() group: FormGroup = null;
    fieldTypes;

    constructor() {
        super();
    }

    ngOnInit() {
        this.fieldTypes = FIELD_TYPES;
    }

}

