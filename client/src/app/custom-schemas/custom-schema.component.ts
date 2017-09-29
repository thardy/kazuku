import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BaseComponent} from "../common/base-component";
import {CustomSchema} from "./custom-schema.model";
import {CustomSchemaService} from "./custom-schema.service";
import {NgForm} from "@angular/forms";
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
    isCreate = false;

    constructor(private route: ActivatedRoute, private customSchemaService: CustomSchemaService, private router: Router) {
        super();
    }

    ngOnInit() {
        this.route.params
            .flatMap((params:Params) => {
                const contentType = params['contentType'] || '';
                if (contentType) {
                    this.contentType = contentType;
                    return this.customSchemaService.getByContentType(this.contentType);
                }
                else {
                    return Observable.of(null);
                }
            })
            .subscribe((customSchema) => {
                if (customSchema) {
                    this.customSchema = customSchema;
                    this.original = Object.assign({}, this.customSchema);
                }
                else {
                    this.isCreate = true;
                    this.customSchema = new CustomSchema();
                }
            });
    }

    save(form: NgForm) {
        // validate form
        if (!form.valid) {
            return;
        }

        this.saving = true;

        if (this.isCreate) {
            this.customSchemaService.create(form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result) => {
                    this.saving = false;
                    this.router.navigateByUrl('content-models');
                });
        }
        else {
            this.customSchemaService.updateByContentType(this.contentType, form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result) => {
                    this.saving = false;
                    this.original = Object.assign({}, this.customSchema);
                    form.form.markAsPristine();
                });
        }
    }

    cancel(form: NgForm){
        if (this.isCreate) {
            this.router.navigateByUrl('content-models');
        }
        else {
            this.customSchema = Object.assign({}, new CustomSchema(this.original));
            form.form.markAsPristine();
        }
    }

}
