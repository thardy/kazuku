import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Template} from '../templates/template.model';
import {TemplateService} from '../templates/template.service';
import {BaseComponent} from '@common/base-component';
import {Observable} from 'rxjs';

import {Site} from '../sites/site.model';
import {SiteService} from '../sites/site.service';

@Component({
    selector: 'kz-page',
    templateUrl: './page.component.html'
})
export class PageComponent extends BaseComponent implements OnInit {

    page: Template = new Template(); // a page is just a Template with a url property
    sites: Site[] = [];
    saving = false;
    original = {};
    pageId: string;
    isCreate = false;

    constructor(private route: ActivatedRoute, private templateService: TemplateService, private router: Router, private siteService: SiteService) {
        super();
    }

    ngOnInit() {
        // this.siteService.getAll()
        //     .subscribe(
        //         (sites) => {
        //             this.sites = sites;
        //         },
        //         (error) => {
        //
        //         }
        //     );
        //
        // this.route.params
        //     .flatMap((params: Params) => {
        //         const id = params['id'] || '';
        //         if (id) {
        //             this.pageId = id;
        //             return this.templateService.getById(this.pageId);
        //         }
        //         else {
        //             return Observable.of(null);
        //         }
        //     })
        //     .subscribe((page) => {
        //         if (page) {
        //             this.page = page;
        //             this.original = Object.assign({}, this.page);
        //         }
        //         else {
        //             this.isCreate = true;
        //             this.page = new Template();
        //         }
        //     });

    }

    // save(form: NgForm) {
    //     // validate form
    //     if (!form.valid) {
    //         return;
    //     }
    //
    //     this.saving = true;
    //
    //     if (this.isCreate) {
    //         this.templateService.create(form.value)
    //             .takeUntil(this.ngUnsubscribe)
    //             .subscribe(
    //                 (result) => {
    //                     this.saving = false;
    //                     this.router.navigateByUrl('pages');
    //                 },
    //                 (error) => {
    //                     this.saving = false;
    //                 }
    //             );
    //     }
    //     else {
    //         this.templateService.update(this.pageId, form.value)
    //             .takeUntil(this.ngUnsubscribe)
    //             .subscribe((result) => {
    //                 this.saving = false;
    //                 this.original = Object.assign({}, this.page);
    //                 form.form.markAsPristine();
    //             });
    //     }
    // }
    //
    // cancel(form: NgForm) {
    //     if (this.isCreate) {
    //         this.router.navigateByUrl('pages');
    //     }
    //     else {
    //         this.page = Object.assign({}, new Template(this.original));
    //         form.form.markAsPristine();
    //     }
    // }
}

