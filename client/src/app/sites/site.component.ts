import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Site} from './site.model';
import {SiteService} from './site.service';
import {BaseComponent} from '../common/base-component';
import {Observable, of} from 'rxjs';

import * as _ from 'lodash';
import {flatMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'kz-site',
  templateUrl: './site.component.html'
})
export class SiteComponent extends BaseComponent implements OnInit {

    site: Site = new Site();
    saving = false;
    original = {};
    siteId: string;
    isCreate = false;

    constructor(private route: ActivatedRoute, private siteService: SiteService, private router: Router) {
        super();
    }

    ngOnInit() {
        this.route.params
            .pipe(
                flatMap((params: Params) => {
                    const id = params['id'] || '';
                    if (id) {
                        this.siteId = id;
                        return this.siteService.getById(this.siteId);
                    }
                    else {
                        return of(null);
                    }
                })
            )
            .subscribe((site) => {
                if (site) {
                    this.site = site;
                    this.original = Object.assign({}, this.site);
                }
                else {
                    this.isCreate = true;
                    this.site = new Site();
                }
            });

    }

    save(form: NgForm) {
        // validate form
        if (!form.valid) {
            return;
        }

        this.saving = true;

        if (this.isCreate) {
            this.siteService.create(form.value)
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe(
                    (result) => {
                        this.saving = false;
                        this.router.navigateByUrl('sites');
                    },
                    (error) => {
                        this.saving = false;
                    }
                );
        }
        else {
            this.siteService.update(this.siteId, form.value)
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe((result) => {
                    this.saving = false;
                    this.original = Object.assign({}, this.site);
                    form.form.markAsPristine();
                });
        }
    }

    cancel(form: NgForm) {
        if (this.isCreate) {
            this.router.navigateByUrl('sites');
        }
        else {
            this.site = Object.assign({}, new Site(this.original));
            form.form.markAsPristine();
        }
    }

    onNameChange(newName: string) {
        const snakeCasedName = _.snakeCase(newName);
        this.site.code = snakeCasedName;
    }
}
