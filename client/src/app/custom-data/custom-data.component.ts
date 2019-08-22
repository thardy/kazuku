import {Component, OnInit} from '@angular/core';
import {CustomSchema} from '../custom-schemas/custom-schema.model';
import {BaseComponent} from '../common/base-component';
import {CustomDataService} from './custom-data.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CustomSchemaService} from '../custom-schemas/custom-schema.service';
import {flatMap, takeUntil} from 'rxjs/operators';


@Component({
    selector: 'kz-custom-data',
    templateUrl: './custom-data.component.html',
})
export class CustomDataComponent extends BaseComponent implements OnInit {

    contentType: string;
    customDataId: string;
    customSchema: CustomSchema = new CustomSchema();
    model: any = {};
    initialModel: any = {};
    original: any = {};
    isEdit = false;
    saving = false;
    validationMessages: string[] = [];

    constructor(private route: ActivatedRoute,
                private customDataService: CustomDataService,
                private customSchemaService: CustomSchemaService,
                private router: Router) {
        super();
    }


    ngOnInit() {
        this.route.params
            .pipe(
                flatMap((params: Params) => {
                    this.contentType = params['contentType'];
                    this.customDataId = params['id'];
                    this.isEdit = this.contentType != null && this.customDataId != null;

                    // todo: what do we do if we don't find a contentType in the routeParams? Perhaps allow selection of a
                    //  contentType if we get here without one.  We have to at least have a contentType
                    return this.customSchemaService.getByContentType(this.contentType);
                })
            )
            .subscribe((customSchema: any) => {
                this.customSchema = customSchema;
                //this.initForm(null);

                if (this.isEdit) {
                    this.customDataService.getByTypeAndId(this.contentType, this.customDataId)
                        .subscribe((data) => {
                            if (data) {
                                this.initialModel = data;
                                this.model = this.initialModel;
                                this.original = Object.assign({}, this.initialModel);
                            }
                        });
                }
            });
    }

    initForm(customData: any) {

    }

    formChanged(newModelValue) {
        this.model = newModelValue;
    }

    save() {
        // validate form
        const errors = this.validate(this.model);

        if (errors.length > 0) {
            this.validationMessages = errors;
            return;
        }

        this.saving = true;

        if (this.isEdit) {
            this.customDataService.updateByTypeAndId(this.contentType, this.customDataId, this.model)
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe(
                    (result) => {
                        this.saving = false;
                        this.router.navigateByUrl('content');
                    },
                    (error) => {
                        this.saving = false;
                    }
                );
        }
        else {
            this.customDataService.createByContentType(this.contentType, this.model)
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe((result) => {
                    this.saving = false;
                    this.original = Object.assign({}, this.model);
                    this.router.navigateByUrl('content');
                });
        }
    }

    cancel() {
        if (this.isEdit) {
            this.model = Object.assign({}, this.original);
            this.initialModel = this.model;
        }

        this.router.navigateByUrl('content');
    }

    validate(model: any): string[] {
        const errors = [];

        // todo: do some validation here

        return errors;
    }

}
