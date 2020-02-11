import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomSchema} from '../../../custom-schemas/custom-schema.model';
import {BaseComponent} from '../../../common/base-component';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomSchemaService} from '../../../custom-schemas/custom-schema.service';
import {ContentModelService} from '../../content-model.service';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'kz-create-model',
    templateUrl: './create-model.component.html',
    styleUrls: ['./create-model.component.scss']
})
export class CreateModelComponent extends BaseComponent implements OnInit {
    modelForm: FormGroup = new FormGroup({});
    customSchema: CustomSchema = new CustomSchema();
    fieldsFormArray = new FormArray([]);
    saving = false;
    isEdit = false;
    contentType: string;
    original = {};
    fieldUx = new Map<FormGroup, any>();

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

    saveModel(form) {
        console.log(form);
        console.log(this.isEdit);
        // validate form
        if (!form.valid) {
            return;
        }

        this.saving = true;
        const customSchema = this.convertFormToCustomSchema(form.value);
        this.customSchema = customSchema;

        if (this.isEdit) {
            this.modelService.update(this.contentType, customSchema)
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe(
                    (result) => {
                        this.original = Object.assign({}, this.customSchema);

                        // save the new originalValues for each field as well
                        for (let i = 0; i < this.fieldsFormArray.length; i++) {
                            const fieldFormGroup = <FormGroup>this.fieldsFormArray.at(i);
                            const fieldUx = this.fieldUx.get(fieldFormGroup);
                            const originalValues = this.getOriginalValuesFromFieldFormGroup(fieldFormGroup);
                            fieldUx.showFieldBuilder = false;
                            fieldUx.saved = true;
                            fieldUx.originalValues = originalValues;
                        }

                        form.markAsPristine();
                        this.router.navigateByUrl('content/models');
                    },
                    (error) => {},
                    () => {
                        this.saving = false;
                    });
        }
        else {
            this.modelService.create(customSchema)
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe(
                    (result) => {
                        this.router.navigateByUrl('content-models');
                    },
                    (error) => {},
                    () => {
                        this.saving = false;
                    });
        }
    }

    convertFormToCustomSchema(formValue: any) {
        const jsonSchema = this.convertFormFieldsToJsonSchema(formValue.fields);
        return new CustomSchema({
            name: formValue.name,
            contentType: formValue.contentType,
            description: formValue.description,
            jsonSchema: jsonSchema
        });
    }

    convertJsonSchemaToFormFields(jsonSchema: any) {
        const fields = [];

        if (jsonSchema.properties) {
            for (const property in jsonSchema.properties) {
                if (jsonSchema.properties.hasOwnProperty(property)) {
                    let type = jsonSchema.properties[property].type;
                    const format = jsonSchema.properties[property].format;

                    if (format) {
                        if (format === 'date-time') {
                            type = 'date';
                        }
                    }
                    const fieldProperty: any = {
                        type: type,
                        description: jsonSchema.properties[property].description,
                        fieldId: property
                    };

                    if (jsonSchema.properties[property].enum) {
                        fieldProperty.type = 'enumeration';
                        fieldProperty.enumerationType = jsonSchema.properties[property].enumerationType;
                    }

                    fields.push(fieldProperty);
                }
            }
        }

        return fields;
    }

    convertFormFieldsToJsonSchema(fields: any[]) {
        const jsonSchema = {
            type: 'object',
            properties: {}
        };

        fields.forEach((field) => {
            jsonSchema.properties[field.fieldId] = {
                type: field.type,
                description: field.description
            };
        });

        return jsonSchema;
    }

    getOriginalValuesFromFieldFormGroup(fieldFormGroup: FormGroup) {
        const originalValues = Object.assign({}, fieldFormGroup.value);
        delete originalValues.originalValues;
        return originalValues;
    }

}
