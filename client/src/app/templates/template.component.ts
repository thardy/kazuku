import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import {Template} from "../templates/template.model";
import {TemplateService} from "../templates/template.service";
import {BaseComponent} from "../common/base-component";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergemap';

const systemProperties = ["_id", "id", "orgId", "siteId", "name", "url", "layout", "description", "template", "created", "createdBy", "updated", "updatedBy", "dependencies", "regenerate"];

@Component({
    selector: 'kz-page',
    templateUrl: './template.component.html'
})
export class TemplateComponent extends BaseComponent implements OnInit {

    template: Template = new Template(); // a page is just a Template with a url property
    saving = false;
    original = {};
    templateId: string;
    isEdit = false;
    dataProperties = [];
    form: FormGroup = new FormGroup({});
    dataPropertiesFormArray = new FormArray([]);

    constructor(private route: ActivatedRoute, private templateService: TemplateService, private router: Router) {
        super();
    }

    ngOnInit() {
        this.route.params
            .subscribe((params:Params) => {
                this.templateId = params['id'];
                this.isEdit = params['id'] != null;
                this.initForm();
            });
    }

    initForm() {
        if (this.isEdit) {
            this.templateService.getById(this.templateId)
                .subscribe((template) => {
                    if (template) {
                        this.template = template;
                        const controlArray = <FormArray>this.form.controls['dataProperties'];

                        for (let property in template) {
                            if (template.hasOwnProperty(property) && !systemProperties.includes(property)) {
                                controlArray.push(
                                    new FormGroup({
                                        'name': new FormControl(property, Validators.required),
                                        'value': new FormControl(template[property])
                                    })
                                );
                                // this.dataProperties.push({name: property, value: template[property]})
                            }
                        }

                        this.original = Object.assign({}, this.template);
                        this.form = this.createFormGroup(this.template, controlArray);
                    }
                });
        }

        this.form = this.createFormGroup(this.template, this.dataPropertiesFormArray);
    }

    createFormGroup(model, dataPropertiesFormArray) {
        return new FormGroup({
            'name': new FormControl(model.name, Validators.required),
            'description': new FormControl(model.description),
            'template': new FormControl(model.template, Validators.required),
            'dataProperties': dataPropertiesFormArray
        });
    }

    // initDataPropertyFormArray(dataProperties: {name: string, value: string }[]) {
    //     let dataPropertiesFormArray = new FormArray([]);
    //     for (let property of dataProperties) {
    //         dataPropertiesFormArray.push(
    //             new FormGroup({
    //                 'name': new FormControl(property.name, Validators.required),
    //                 'value': new FormControl(property.value)
    //             })
    //         );
    //     }
    //
    //     return dataPropertiesFormArray;
    // }

    save(form) {
        // validate form
        if (!form.valid) {
            return;
        }

        this.saving = true;
        const templateObject = this.createTemplateObjectFromForm(this.template, form.value);
        this.template = templateObject;

        if (this.isEdit) {
            this.templateService.update(this.templateId, templateObject)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result) => {
                    this.saving = false;
                    this.original = Object.assign({}, this.template);
                    form.form.markAsPristine();
                });
        }
        else {
            this.templateService.create(templateObject)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(
                    (result) => {
                        this.saving = false;
                        this.router.navigateByUrl('templates');
                    },
                    (error) => {
                        this.saving = false;
                    }
                );
        }
    }

    cancel(form){
        if (this.isEdit) {
            this.template = Object.assign({}, new Template(this.original));
            form.form.markAsPristine();
        }
        else {
            this.router.navigateByUrl('pages');
        }
    }

    saveDataProperty(dataProperty) {
        let i = 0;
    }

    addDataProperty() {
        const control = <FormArray>this.form.controls['dataProperties'];
        control.push(
            new FormGroup({
                'name': new FormControl(null, Validators.required),
                'value': new FormControl(null)
            })
        );
    }

    deleteDataProperty(index: number) {
        const control = <FormArray>this.form.controls['dataProperties'];
        control.removeAt(index);
    }

    createTemplateObjectFromForm(templateObject: any, formValue: any) {
        const template = Object.assign({}, formValue);
        delete template.dataProperties;

        // Add dataProperties as properties on the templateObject
        if (formValue.dataProperties) {
            formValue.dataProperties.forEach((property) => {
                template[property.name] = property.value;
            })
        }

        return template;
    }
}

