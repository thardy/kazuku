import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Template} from "./template.model";
import {TemplateService} from "./template.service";
import 'rxjs/add/operator/mergemap';

@Component({
    selector: 'kz-template-detail',
    templateUrl: './template-detail.component.html',
    styleUrls: []
})
export class TemplateDetailComponent implements OnInit {

    template: Template = new Template();

    constructor(private route: ActivatedRoute, private templateService: TemplateService) {
    }

    ngOnInit() {
        this.route.params
            .flatMap((params:Params) => {
                let id = params['id'] || 0;
                return this.templateService.getById(id)
            })
            .subscribe((template) => {
                this.template = template;
            });
    }
}
