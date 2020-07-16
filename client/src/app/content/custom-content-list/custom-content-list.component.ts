import {Component, OnInit} from '@angular/core';
import {ContentService} from '../content.service';
import {CustomSchema} from '../../custom-schemas/custom-schema.model';
import {Observable} from 'rxjs';

@Component({
    selector: 'kz-custom-content-list',
    templateUrl: './custom-content-list.component.html',
    styleUrls: ['./custom-content-list.component.less']
})
export class CustomContentListComponent implements OnInit {
    customContentList$: Observable<any[]>;
    customSchemas$: Observable<CustomSchema[]>;

    constructor(private contentService: ContentService) {
    }

    ngOnInit() {
        this.customContentList$ = this.contentService.getAll();
    }

}
