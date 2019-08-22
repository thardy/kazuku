import {Component, OnInit} from '@angular/core';
import {TemplateService} from '../templates/template.service';
import {Router} from '@angular/router';
import {Template} from '../templates/template.model';

@Component({
    selector: 'kz-page-list',
    templateUrl: './page-list.component.html'
})
export class PageListComponent implements OnInit {

    pages: Template[] = [];
    loading = false;

    constructor(private templateService: TemplateService, private router: Router) {
    }

    ngOnInit() {
        this.templateService.getAllPages()
            .subscribe(
                (pages: any) => {
                    this.pages = pages;
                    this.loading = false;
                },
                (error) => {
                    this.loading = false;
                }
            );
    }

    create() {
        this.router.navigateByUrl('pages/create');
    }

}
