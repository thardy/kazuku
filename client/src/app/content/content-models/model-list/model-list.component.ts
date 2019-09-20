import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CustomSchema} from '../../../custom-schemas/custom-schema.model';
import {ContentModelService} from '../../content-model.service';
import {Router} from '@angular/router';

@Component({
    selector: 'kz-model-list',
    templateUrl: './model-list.component.html',
    styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent implements OnInit {

    contentModels$: Observable<CustomSchema[]>;

    constructor(private modelService: ContentModelService,
                private router: Router) {
    }

    ngOnInit() {
        // this.contentModels$ = this.modelService.getAll();
    }

    createModel() {
        this.router.navigateByUrl('create');
    }

}
