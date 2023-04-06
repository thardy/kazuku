import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {BaseComponent} from '@common/base-component';
import {CustomSchema} from './custom-schema.model';
import {CustomSchemaService} from './custom-schema.service';
import {NgForm, FormArray, FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';
import {Observable} from 'rxjs';

import * as _ from 'lodash-es';
import {switchMap, takeUntil, tap} from 'rxjs/operators';

const MANDATORY_FIELDS = ['name'];

@Component({
    selector: 'kz-custom-schema',
    templateUrl: './custom-schema.component.html'
})
export class CustomSchemaComponent extends BaseComponent implements OnInit {
    schema$: Observable<CustomSchema>;
    customSchema: CustomSchema = new CustomSchema();
    saving = false;
    original = {};
    contentType: string;
    isEdit = false;
    form: FormGroup = new FormGroup({});
    fieldsFormArray = new FormArray([]); // the dynamic part of our form - one for every field on the customSchema
    jsonSchemaString: string;
    fieldUx = new Map<FormGroup, any>();

    constructor(private route: ActivatedRoute,
                private customSchemaService: CustomSchemaService,
                private router: Router) {
        super();
    }

    ngOnInit() {
        this.schema$ = this.route.params.pipe(
            tap((params: Params) => {
                this.contentType = params['contentType'];
                this.isEdit = params['contentType'] != null;
            }),
            switchMap((params: Params) => {
                return this.customSchemaService.getByContentType(params['contentType']);
            }),
            tap((schema: CustomSchema) => {
                console.log(schema);
            })
        );

        this.route.params
            .subscribe((params: Params) => {
                this.contentType = params['contentType'];
                this.isEdit = params['contentType'] != null;
                // let initialCustomSchema = null;
                if (!this.isEdit) {
                    const mandatoryFields = this.createMandatoryFields();
                    this.initFieldsForm(this.fieldsFormArray, mandatoryFields);
                }
                // this.initForm(initialCustomSchema);
                this.initForm(null);
            });

        // MUST create formModel to back the template html right at the beginning.  Can't wait for any async stuff to happen.
        //  The async stuff can modify it, but we basically can't leave ngOnInit without the backing form model being built.
        this.form = new FormGroup({
            'name': new FormControl(this.customSchema.name, Validators.required),
            'contentType': new FormControl(this.customSchema.contentType, Validators.required),
            'description': new FormControl(this.customSchema.description),
            'fields': this.fieldsFormArray
        });
    }

    initForm(fields) {
        if (fields) {
            this.initFieldsForm(this.fieldsFormArray, fields);
        }
        else if (this.isEdit) {
            this.customSchemaService.getByContentType(this.contentType)
                .subscribe((fetchedCustomSchema: any) => {
                    if (fetchedCustomSchema) {
                        this.customSchema = fetchedCustomSchema;
                        this.form.patchValue(fetchedCustomSchema);
                        const formFields = this.convertJsonSchemaToFormFields(fetchedCustomSchema.jsonSchema);
                        this.initFieldsForm(this.fieldsFormArray, formFields);
                        this.original = Object.assign({}, fetchedCustomSchema);
                    }
                });
        }
    }

    initFieldsForm(fieldsFormArray: FormArray, fields: any) {
        this.clearFormArray(fieldsFormArray);

        // create the backing FormArray for the fields
        for (const field of fields) {
            // this is what adds the new field controls to the form
            const formGroup = new FormGroup({
                'type': new FormControl(field.type),
                'description': new FormControl(field.description),
                'fieldId': new FormControl(field.fieldId)
            });

            fieldsFormArray.push(formGroup);
            const originalValues = this.getOriginalValuesFromFieldFormGroup(formGroup);
            let isMandatory = false;
            if (MANDATORY_FIELDS.find(f => f === field.fieldId)) {
                isMandatory = true;
            }
            this.fieldUx.set(formGroup, {showFieldBuilder: false, saved: true, originalValues: originalValues, isMandatory: isMandatory});
        }
    }

    createMandatoryFields() {
        const mandatoryFields = [
            { type: 'string', description: 'Name', fieldId: 'name' }
        ];

        return mandatoryFields;
    }

    save(form) {
        // validate form
        if (!form.valid) {
            return;
        }

        this.saving = true;
        const customSchema = this.convertFormToCustomSchema(form.value);
        this.customSchema = customSchema;

        if (this.isEdit) {
            this.customSchemaService.update(this.contentType, customSchema)
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
                        this.router.navigateByUrl('content-models');
                    },
                    (error) => {},
                    () => {
                        this.saving = false;
                    });
        }
        else {
            this.customSchemaService.create(customSchema)
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

    cancel(form) {
        this.router.navigateByUrl('content-models');

        // if (this.isEdit) {
        //     this.customSchema = Object.assign({}, new CustomSchema(this.original));
        //     form.markAsPristine();
        //     // re-initialize form
        //     this.initForm(this.customSchema);
        // }
        // else {
        //     this.router.navigateByUrl('content-models');
        // }
    }

    addField() {
        const formGroup = new FormGroup({
            'type': new FormControl(null),
            'description': new FormControl(null),
            'fieldId': new FormControl(null)
        });
        this.fieldsFormArray.push(formGroup);
        this.fieldUx.set(formGroup, this.initNewFieldUx());
    }

    editField(field: FormGroup) {
        //field.value.showFieldBuilder = true;
        const fieldUx = this.fieldUx.get(field);
        fieldUx.showFieldBuilder = true;
    }

    deleteField(field: FormGroup) {
        const index = this.getIndexOfItemInFormArray(this.fieldsFormArray, field);
        this.fieldsFormArray.removeAt(index);
    }

    saveField(field: FormGroup) {
        //field.value.showFieldBuilder = false;
        const fieldUx = this.fieldUx.get(field);
        fieldUx.showFieldBuilder = false;
        fieldUx.newField = false;
    }

    cancelField(field: FormGroup) {
        const fieldUx = this.fieldUx.get(field);
        const index = this.getIndexOfItemInFormArray(this.fieldsFormArray, field);
        const foundField = this.fieldsFormArray.at(index);
        if (foundField && !fieldUx.saved) {
            this.fieldsFormArray.removeAt(index);
        }
        else {
            foundField.patchValue(fieldUx.originalValues);
            fieldUx.showFieldBuilder = false;
        }
    }

    getIndexOfItemInFormArray(formArray: FormArray, control: AbstractControl) {
        let index = -1;
        for (let i = 0; i < formArray.length; i++) {
            if (formArray.controls[i] === control) {
                index = i;
                break;
            }
        }
        return index
    }

    convertCustomSchemaToForm(customSchema) {
        const fields = this.convertJsonSchemaToFormFields(customSchema.jsonSchema);
        const formValue = {
            name: customSchema.name,
            contentType: customSchema.contentType,
            description: customSchema.description,
            fields: fields
        };
        return formValue;
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

    clearFormArray(formArray: FormArray) {
        for (let i = formArray.controls.length - 1; i >= 0; i--) {
            formArray.removeAt(i);
        }
    }

    generateSchema() {
        const jsonSchema = this.convertFormFieldsToJsonSchema(this.form.value.fields);
        this.jsonSchemaString = JSON.stringify(jsonSchema);
    }

    getOriginalValuesFromFieldFormGroup(fieldFormGroup: FormGroup) {
        const originalValues = Object.assign({}, fieldFormGroup.value);
        delete originalValues.originalValues;
        return originalValues;
    }

    initNewFieldUx() {
        return {showFieldBuilder: true, newField: true, saved: false, originalValues: {}};
    }

    onDisplayNameChange(newDisplayName: any) {
        console.log(newDisplayName);
        // const snakeCasedDisplayName = _.snakeCase(newDisplayName);
        // const newValue = {contentType: snakeCasedDisplayName};
        // this.form.patchValue(newValue);
    }
}
