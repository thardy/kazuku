import {Component, OnInit} from '@angular/core';
import {CustomSchema} from './custom-schema.model';
import {CustomSchemaService} from './custom-schema.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
    selector: 'kz-custom-schemas',
    templateUrl: './custom-schema-list.component.html'
})
export class CustomSchemaListComponent implements OnInit {

    customSchemas$: Observable<CustomSchema[]> = this.customSchemaService.getAll();

    constructor(private customSchemaService: CustomSchemaService,
                private router: Router) {
    }

    ngOnInit() {}

    create() {
        this.router.navigateByUrl('content-models/create');
    }

}
