import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomSchema} from '../../../custom-schemas/custom-schema.model';
import {BaseComponent} from '../../../common/base-component';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomSchemaService} from '../../../custom-schemas/custom-schema.service';
import {ContentModelService} from '../../content-model.service';

@Component({
    selector: 'kz-create-model',
    templateUrl: './create-model.component.html',
    styleUrls: ['./create-model.component.scss']
})
export class CreateModelComponent extends BaseComponent implements OnInit {
    modelForm: FormGroup = new FormGroup({});
    customSchema: CustomSchema = new CustomSchema();
    fieldsFormArray = new FormArray([]);

    constructor(private route: ActivatedRoute,
                private modelService: ContentModelService,
                private router: Router) {
        super();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.modelForm = new FormGroup({
            'name': new FormControl(this.customSchema.name, Validators.required),
            'contentType': new FormControl(this.customSchema.contentType, Validators.required),
            'description': new FormControl(this.customSchema.description),
            'fields': this.fieldsFormArray
        });
    }

}
