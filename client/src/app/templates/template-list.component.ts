import {Component, OnInit} from '@angular/core';
import {Template} from "./template.model";
import {TemplateService} from "./template.service";
import {Router} from "@angular/router";

@Component({
    selector: 'kz-template-list',
    templateUrl: './template-list.component.html'
})
export class TemplateListComponent implements OnInit {

    templates: Template[] = [];

    constructor(private templateService: TemplateService, private router: Router) {
    }

    ngOnInit() {
        this.templateService.getAll()
            .subscribe((templates) => {
                this.templates = templates;
            });
    }

    create() {
        this.router.navigateByUrl('templates/create');
    }

}

