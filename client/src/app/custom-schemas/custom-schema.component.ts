import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BaseComponent} from "../common/base-component";
import {CustomSchema} from "./custom-schema.model";
import {CustomSchemaService} from "./custom-schema.service";
import {NgForm, FormArray, FormGroup, FormControl, Validators, AbstractControl} from "@angular/forms";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergemap';

@Component({
    selector: 'kz-custom-schema',
    templateUrl: './custom-schema.component.html'
})
export class CustomSchemaComponent extends BaseComponent implements OnInit {
    customSchema: CustomSchema = new CustomSchema();
    saving = false;
    original = {};
    contentType: string;
    isEdit = false;
    form: FormGroup = new FormGroup({});
    fieldsFormArray = new FormArray([]); // the dynamic part of our form - one for every field on the customSchema
    jsonSchemaString: string;
    fieldUx = new Map<FormGroup, any>();

    constructor(private route: ActivatedRoute, private customSchemaService: CustomSchemaService, private router: Router) {
        super();
    }

    ngOnInit() {
        this.route.params
            .subscribe((params:Params) => {
                this.contentType = params['contentType'];
                this.isEdit = params['contentType'] != null;
                this.initForm(null);
            });

        // MUST create formModel to back the template html right at the beginning.  Can't wait for any async stuff to happen.
        //  The async stuff can modify it, but we basically can't leave ngOnInit without the backing form model being built.
        this.form = new FormGroup({
            'contentType': new FormControl(this.customSchema.contentType, Validators.required),
            'description': new FormControl(this.customSchema.description),
            'fields': this.fieldsFormArray
        });
    }

    initForm(customSchema: CustomSchema) {
        if (customSchema) {
            const formValue = this.convertCustomSchemaToForm(customSchema);
            this.form.patchValue(formValue);
        }
        else if (this.isEdit) {
            this.customSchemaService.getByContentType(this.contentType)
                .subscribe((customSchema) => {
                    if (customSchema) {
                        this.customSchema = customSchema;
                        this.form.patchValue(customSchema);
                        const fields = this.convertJsonSchemaToFormFields(customSchema.jsonSchema);
                        this.initFieldsForm(this.fieldsFormArray, fields);
                        this.original = Object.assign({}, customSchema);
                    }
                });
        }
    }

    initFieldsForm(fieldsFormArray: FormArray, fields: any) {
        this.clearFormArray(fieldsFormArray);

        // create the backing FormArray for the fields
        for (let field of fields) {
            // this is what adds the new field controls to the form
            let formGroup = new FormGroup({
                'type': new FormControl(field.type),
                'name': new FormControl(field.name),
                'title': new FormControl(field.title)
            });

            fieldsFormArray.push(formGroup);
            const originalValues = this.getOriginalValuesFromFieldFormGroup(formGroup);
            this.fieldUx.set(formGroup, {showFieldBuilder: false, saved: true, originalValues: originalValues});
        }
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
                .takeUntil(this.ngUnsubscribe)
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
                .takeUntil(this.ngUnsubscribe)
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

    cancel(form){
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
        let formGroup = new FormGroup({
            'type': new FormControl(null),
            'name': new FormControl(null),
            'title': new FormControl(null)
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
        let index = this.getIndexOfItemInFormArray(this.fieldsFormArray, field);
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
        let index = this.getIndexOfItemInFormArray(this.fieldsFormArray, field);
        let foundField = this.fieldsFormArray.at(index);
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
        for (let i = 0; i < formArray.length; i++){
            if (formArray.controls[i] == control) {
                index = i;
                break;
            }
        }
        return index
    }

    convertCustomSchemaToForm(customSchema) {
        const fields = this.convertJsonSchemaToFormFields(customSchema.jsonSchema);
        const formValue = {
            contentType: customSchema.contentType,
            description: customSchema.description,
            fields: fields
        };
        return formValue;
    }

    convertFormToCustomSchema(formValue: any) {
        const jsonSchema = this.convertFormFieldsToJsonSchema(formValue.fields);
        return new CustomSchema({
            contentType: formValue.contentType,
            description: formValue.description,
            jsonSchema: jsonSchema
        });
    }

    convertJsonSchemaToFormFields(jsonSchema: any) {
        const fields = [];

        if (jsonSchema.properties) {
            for (let property in jsonSchema.properties) {
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
                        name: jsonSchema.properties[property].name,
                        title: jsonSchema.properties[property].title
                    };

                    if (jsonSchema.properties[property].enum) {
                        fieldProperty.type = 'enumeration';
                        fieldProperty.enumerationType = jsonSchema.properties[property].enumerationType;
                    }

                    fields.push(fieldProperty)
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
            jsonSchema.properties[field.name] = {
                type: field.type,
                name: field.name,
                title: field.title
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
        let originalValues = Object.assign({}, fieldFormGroup.value);
        delete originalValues.originalValues;
        return originalValues;
    }

    initNewFieldUx() {
        return {showFieldBuilder: true, newField: true, saved: false, originalValues: {}};
    }

}
