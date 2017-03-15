import {Component, OnInit} from '@angular/core';
import {TemplateService} from "./template.service";
import {Template} from "./template.model";

@Component({
    selector: 'kz-templates',
    templateUrl: './template-list.component.html',
    styleUrls: []
})
export class TemplateListComponent implements OnInit {
    templates: Template[] = [];

    constructor(private templateService: TemplateService) {
    }

    ngOnInit() {
        this.templateService.getAll()
            .subscribe((templates) => {
                this.templates = templates;
            });
    }

}
