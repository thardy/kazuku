import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CustomDataService} from './custom-data.service';
import {CustomSchemaService} from '../custom-schemas/custom-schema.service';
import {CustomSchema} from '../custom-schemas/custom-schema.model';

@Component({
  selector: 'kz-custom-data',
  templateUrl: './custom-data-list.component.html'
})
export class CustomDataListComponent implements OnInit {

    customDataList: any[] = [];
    customSchemas: CustomSchema[] = [];
    selectedContentType: string;
    showSchemaList = false;

    constructor(private customDataService: CustomDataService, private customSchemaService: CustomSchemaService, private router: Router) {
    }

    ngOnInit() {
        this.customDataService.getAll()
            .subscribe((customDataList) => {
                this.customDataList = customDataList;
            });

        this.customSchemaService.getAll()
            .subscribe((customSchemas) => {
                this.customSchemas = customSchemas;
            });
    }

    create() {
        this.showSchemaList = true;
    }

    contentTypeSelected() {
        this.router.navigateByUrl(`content/create/${this.selectedContentType}`);
        this.showSchemaList = false;
    }

}
