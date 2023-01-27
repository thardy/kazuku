import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TemplateService} from "../template.service";
import {Template} from "../template.model";

@Component({
    selector: 'kz-template-list',
    templateUrl: './template-list.component.html'
})
export class TemplateListComponent implements OnInit {

    templates: Template[] = [];

    constructor(private templateService: TemplateService,
                private router: Router) {
    }

    ngOnInit() {
        this.templateService.getAllNonPageTemplates()
            .subscribe((templates: any) => {
                this.templates = templates;
            });
    }

    create() {
        this.router.navigateByUrl('templates/create');
    }

}

