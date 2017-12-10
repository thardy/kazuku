import {Component, OnInit} from '@angular/core';
import {CustomSchema} from '../custom-schemas/custom-schema.model';
import {BaseComponent} from '../common/base-component';
import {CustomDataService} from './custom-data.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CustomSchemaService} from '../custom-schemas/custom-schema.service';
import 'rxjs/add/operator/mergeMap';

@Component({
    selector: 'kz-custom-data',
    templateUrl: './custom-data.component.html',
})
export class CustomDataComponent extends BaseComponent implements OnInit {

    contentType: string;
    customDataId: string;
    customSchema: CustomSchema = new CustomSchema();
    model: any = {};
    original: any = {};
    isEdit = false;

    constructor(private route: ActivatedRoute,
                private customDataService: CustomDataService,
                private customSchemaService: CustomSchemaService,
                private router: Router) {
        super();
    }


    ngOnInit() {
        this.route.params
            .flatMap((params: Params) => {
                this.contentType = params['contentType'];
                this.customDataId = params['customDataId'];
                this.isEdit = params['customDataId'] != null;

                // todo: what do we do if we don't find a contentType in the routeParams? Perhaps allow selection of a
                //  contentType if we get here without one.
                return this.customSchemaService.getByContentType(this.contentType);
            })
            .subscribe((customSchema) => {
                this.customSchema = customSchema;
                this.initForm(null);
            });
    }

    initForm(customData: any) {
        if (customData) {
            this.model = customData;
        }
        else if (this.isEdit) {
            this.customDataService.getByTypeAndId(this.contentType, this.customDataId)
                .subscribe((data) => {
                    if (data) {
                        this.model = data;
                        this.original = Object.assign({}, this.model);
                    }
                });
        }
    }

}
