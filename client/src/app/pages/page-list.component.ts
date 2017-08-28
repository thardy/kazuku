import {Component, OnInit} from '@angular/core';
import {Page} from "./page.model";
import {TemplateService} from "../templates/template.service";
import {Router} from "@angular/router";

@Component({
    selector: 'kz-page-list',
    templateUrl: './page-list.component.html'
})
export class PageListComponent implements OnInit {

    pages: Page[] = [];

    constructor(private templateService: TemplateService, private router: Router) {
    }

    ngOnInit() {
        // this.templateService.getAllPages()
        //     .subscribe((pages) => {
        //         this.pages = pages;
        //     });
    }

    create() {
        this.router.navigateByUrl('pages/create');
    }

}
