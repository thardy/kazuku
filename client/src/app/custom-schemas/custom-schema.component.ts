import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BaseComponent} from "../common/base-component";
import {CustomSchema} from "./custom-schema.model";
import {CustomSchemaService} from "./custom-schema.service";
import {NgForm, FormArray, FormGroup, FormControl, Validators} from "@angular/forms";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergemap';

const systemProperties = ["_id", "id", "orgId", "contentType", "description", "created", "createdBy", "updated", "updatedBy", "dependencies", "regenerate"];

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
    fieldsFormArray = new FormArray([]); // the dynamic part of our form - one for every templateObject property that is not a system property

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
            this.form.patchValue(customSchema);
        }
        else if (this.isEdit) {
            this.customSchemaService.getByContentType(this.contentType)
                .subscribe((customSchema) => {
                    if (customSchema) {
                        this.customSchema = customSchema;
                        this.form.patchValue(customSchema);
                        this.initFieldsForm(customSchema);
                        this.original = Object.assign({}, customSchema);
                    }
                });
        }
    }

    initFieldsForm(customSchema: CustomSchema) {
        this.clearFormArray(this.fieldsFormArray);

        // todo: unpack customFields from the jsonSchema and create the backing FormArray for them
        // for (let property in customSchema) {
        //     if (customSchema.hasOwnProperty(property) && !systemProperties.includes(property)) {
        //         // this is what adds the new dataProperty controls to the form
        //         this.fieldsFormArray.push(
        //             new FormGroup({
        //                 'type': new FormControl(null),
        //                 'name': new FormControl(null),
        //                 'fieldId': new FormControl(null)
        //             })
        //         );
        //     }
        // }
    }

    save(form) {
        // validate form
        if (!form.valid) {
            return;
        }

        this.saving = true;
        const customSchema = this.createCustomSchemaFromForm(form.value);
        this.customSchema = customSchema;

        if (this.isEdit) {
            this.customSchemaService.update(this.contentType, customSchema)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result) => {
                    this.saving = false;
                    this.original = Object.assign({}, this.customSchema);
                    form.form.markAsPristine();
                });
        }
        else {
            this.customSchemaService.create(customSchema)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(
                    (result) => {
                        this.saving = false;
                        this.router.navigateByUrl('content-models');
                    },
                    (error) => {
                        this.saving = false;
                    }
                );
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
                'fieldId': new FormControl(null)
            })
        );
    }

    deleteField(index: number) {
        this.fieldsFormArray.removeAt(index);
    }

    createCustomSchemaFromForm(formValue: any) {
        const customSchema = Object.assign(new CustomSchema(), formValue);
        customSchema.jsonSchema = this.createJsonSchemaFromForm(formValue);

        return customSchema;
    }

    createJsonSchemaFromForm(formValue: any) {
        // todo: make it work
        const jsonSchema = {};


        return jsonSchema;
    }

    clearFormArray(formArray: FormArray) {
        for (let i = formArray.controls.length - 1; i >= 0; i--) {
            formArray.removeAt(i);
        }
    }

}
