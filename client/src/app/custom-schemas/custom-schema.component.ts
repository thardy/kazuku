import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BaseComponent} from "../common/base-component";
import {CustomSchema} from "./custom-schema.model";
import {CustomSchemaService} from "./custom-schema.service";
import {NgForm, FormArray, FormGroup, FormControl, Validators} from "@angular/forms";
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
    fieldTypes;
    contentType: string;
    isEdit = false;
    form: FormGroup = new FormGroup({});
    fieldsFormArray = new FormArray([]); // the dynamic part of our form - one for every field on the customSchema
    jsonSchemaString: string;

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
            fieldsFormArray.push(
                new FormGroup({
                    'type': new FormControl(field.type),
                    'name': new FormControl(field.name),
                    'title': new FormControl(field.title)
                })
            );
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
                        form.form.markAsPristine();
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
        if (this.isEdit) {
            this.customSchema = Object.assign({}, new CustomSchema(this.original));
            form.form.markAsPristine();
            // re-initialize form
            this.initForm(this.customSchema);
        }
        else {
            this.router.navigateByUrl('content-models');
        }
    }

    addField() {
        this.fieldsFormArray.push(
            new FormGroup({
                'type': new FormControl(null),
                'name': new FormControl(null),
                'title': new FormControl(null)
            })
        );
    }

    editField(field: any) {
        field.showFieldBuilder = true;
    }

    deleteField(index: number) {
        this.fieldsFormArray.removeAt(index);
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

}
