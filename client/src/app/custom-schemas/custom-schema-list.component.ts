import {Component, OnInit} from '@angular/core';
import {CustomSchema} from "./custom-schema.model";
import {CustomSchemaService} from "./custom-schema.service";
import {Router} from "@angular/router";

@Component({
    selector: 'kz-custom-schemas',
    templateUrl: './custom-schema-list.component.html'
})
export class CustomSchemaListComponent implements OnInit {

    customSchemas: CustomSchema[] = [];

    constructor(private customSchemaService: CustomSchemaService, private router: Router) {
    }

    ngOnInit() {
        this.customSchemaService.getAll()
            .subscribe((customSchemas) => {
                this.customSchemas = customSchemas;
            });
    }

    create() {
        this.router.navigateByUrl('content-models/create');
    }

}
