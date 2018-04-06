import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import {Template} from '../templates/template.model';
import {TemplateService} from '../templates/template.service';
import {BaseComponent} from '../common/base-component';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import {SiteService} from '../sites/site.service';
import {Site} from '../sites/site.model';

const systemProperties = ['_id', 'id', 'orgId', 'siteId', 'name', 'url', 'layout', 'description', 'template', 'created', 'createdBy', 'updated', 'updatedBy', 'dependencies', 'regenerate'];

@Component({
    selector: 'kz-template',
    templateUrl: './template.component.html'
})
export class TemplateComponent extends BaseComponent implements OnInit {
    @Input() isInPageMode = false;
    template: Template = new Template(); // a page is just a Template with a url property
    saving = false;
    sites: Site[] = [];
    original = {};
    templateId: string;
    isEdit = false;
    form: FormGroup = new FormGroup({});
    dataPropertiesFormArray = new FormArray([]); // the dynamic part of our form - one for every templateObject property that is not a system property

    constructor(private route: ActivatedRoute, private templateService: TemplateService, private router: Router, private siteService: SiteService) {
        super();
    }

    ngOnInit() {
        this.siteService.getAll()
            .subscribe(
                (sites) => {
                    this.sites = sites;
                },
                (error) => {

                }
            );

        this.route.params
            .subscribe((params: Params) => {
                this.templateId = params['id'];
                this.isEdit = params['id'] != null;
                this.initForm(null);
            });

        // MUST create formModel to back the template right at the beginning.  Can't wait for any async stuff to happen.
        //  The async stuff can modify it, but we basically can't leave ngOnInit without the backing form model being built.
        this.form = new FormGroup({
            'siteId': new FormControl(this.template.siteId, Validators.required),
            'name': new FormControl(this.template.name, Validators.required),
            'description': new FormControl(this.template.description),
            'template': new FormControl(this.template.template, Validators.required),
            'dataProperties': this.dataPropertiesFormArray
        });
        if (this.isInPageMode) {
            this.form.controls['url'] = new FormControl(this.template.url, Validators.required);
        }
    }

    initForm(template: any) {
        if (template) {
            this.form.patchValue(template);
        }
        else if (this.isEdit) {
            this.templateService.getById(this.templateId)
                .subscribe((retrievedTemplate) => {
                    if (retrievedTemplate) {
                        this.template = retrievedTemplate;
                        this.form.patchValue(retrievedTemplate);
                        this.initDataPropertiesForm(retrievedTemplate);
                        this.original = Object.assign({}, retrievedTemplate);
                    }
                });
        }
    }

    initDataPropertiesForm(template: any) {
        this.clearFormArray(this.dataPropertiesFormArray);

        for (const property in template) {
            if (template.hasOwnProperty(property) && !systemProperties.includes(property)) {
                // this is what adds the new dataProperty controls to the form
                this.dataPropertiesFormArray.push(
                    new FormGroup({
                        'name': new FormControl(property),
                        'value': new FormControl(template[property])
                    })
                );
            }
        }
    }

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
                .subscribe(
                    (result) => {
                        this.original = Object.assign({}, this.template);
                        if (form && form.form) {
                            form.form.markAsPristine(); // todo: I don't think this is doing anything.  Fix.
                        }
                        this.router.navigateByUrl(this.isInPageMode ? 'pages' : 'templates');
                    },
                    (error) => {},
                    () => {
                        this.saving = false;
                    });
        }
        else {
            this.templateService.create(templateObject)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(
                    (result) => {
                        this.router.navigateByUrl(this.isInPageMode ? 'pages' : 'templates');
                    },
                    (error) => {},
                    () => {
                        this.saving = false;
                    }
                );
        }
    }

    cancel(form) {
        if (this.isEdit) {
            // this.template = Object.assign({}, new Template(this.original));
            // if (form && form.form) {
            //     form.form.markAsPristine();
            // }
            // re-initialize form
            //this.initForm(this.template);
            this.router.navigateByUrl(this.isInPageMode ? 'pages' : 'templates');
        }
        else {
            this.router.navigateByUrl(this.isInPageMode ? 'pages' : 'templates');
        }
    }

    addDataProperty() {
        this.dataPropertiesFormArray.push(
            new FormGroup({
                'name': new FormControl(null),
                'value': new FormControl(null)
            })
        );
    }

    deleteDataProperty(index: number) {
        this.dataPropertiesFormArray.removeAt(index);
    }

    createTemplateObjectFromForm(templateObject: any, formValue: any) {
        const template = Object.assign({}, formValue);
        delete template.dataProperties;

        // Add dataProperties as properties on the templateObject itself
        if (formValue.dataProperties) {
            formValue.dataProperties.forEach((property) => {
                template[property.name] = property.value;
            });
        }

        return template;
    }

    clearFormArray(formArray: FormArray) {
        for (let i = formArray.controls.length - 1; i >= 0; i--) {
            formArray.removeAt(i);
        }
    }
}

