import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from "../common/base-component";
import {FormGroup} from '@angular/forms';
import 'rxjs/add/operator/mergemap';

const FIELD_TYPES = ["string", "number", "date"];

@Component({
    selector: 'kz-field-builder',
    templateUrl: './field-builder.component.html'
})
export class FieldBuilderComponent extends BaseComponent implements OnInit {
    @Input() group: FormGroup = null;
    @Output() save = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() delete = new EventEmitter();
    fieldTypes;

    constructor() {
        super();
    }

    ngOnInit() {
        this.fieldTypes = FIELD_TYPES;
    }

    onSave(group: FormGroup) {
        //this.save.emit(this.group.controls[index]);
        this.save.emit(group);
    }

    onCancel(group: FormGroup) {
        this.cancel.emit(group);
    }

    onDelete(group: FormGroup) {
        this.delete.emit(group);
    }

}

