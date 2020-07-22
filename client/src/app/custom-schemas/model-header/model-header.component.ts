import {Component, Input, OnInit} from '@angular/core';
import {CustomSchema} from '../custom-schema.model';
import {Observable} from 'rxjs';

@Component({
    selector: 'kz-model-header',
    templateUrl: './model-header.component.html',
    styleUrls: ['./model-header.component.less']
})
export class ModelHeaderComponent implements OnInit {
    @Input() model$: Observable<CustomSchema>;

    constructor() {
    }

    ngOnInit() {
    }

}
