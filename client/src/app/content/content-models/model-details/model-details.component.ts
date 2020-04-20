import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CustomSchema} from '../../../custom-schemas/custom-schema.model';
import {ActivatedRoute, Params} from '@angular/router';
import {ContentModelService} from '../../content-model.service';
import {share, switchMap, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../common/base-component';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'kz-model-details',
    templateUrl: './model-details.component.html',
    styleUrls: ['./model-details.component.scss']
})
export class ModelDetailsComponent extends BaseComponent implements OnInit {
    customSchema$: Observable<CustomSchema>;

    schemaForm: FormGroup = new FormGroup({
        'name': new FormControl('', Validators.required),
        'contentType': new FormControl('', Validators.required),
        'description': new FormControl(''),
        'fields': new FormArray([])
    });

    constructor(private route: ActivatedRoute,
                private modelService: ContentModelService) {
        super();
    }

    ngOnInit() {
        this.getSchema();
    }

    getSchema() {
        this.customSchema$ = this.route.params.pipe(
            switchMap((params: Params) => {
                return this.modelService.getByContentType(params['contentType']);
            })
        );
        this.customSchema$.pipe(share());
    }



}
