import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {of} from 'rxjs';

import * as _ from 'lodash-es';
import {switchMap, takeUntil} from 'rxjs/operators';
import {BaseComponent} from "@common/base-component";
import {QueryService} from "../query.service";
import {Query} from "../query.model";

@Component({
    selector: 'kz-query',
    templateUrl: './query.component.html'
})
export class QueryComponent extends BaseComponent implements OnInit {

    query: Query = new Query();
    saving = false;
    original = {};
    queryNameId: string;
    isCreate = false;

    constructor(private route: ActivatedRoute, private queryService: QueryService, private router: Router) {
        super();
    }

    ngOnInit() {
        this.route.params
            .pipe(
                switchMap((params: Params) => {
                    const nameId = params['nameId'] || '';
                    if (nameId) {
                        this.queryNameId = nameId;
                        return this.queryService.getByNameId(this.queryNameId);
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe((query: Query) => {
                if (query) {
                    this.query = query;
                    this.original = Object.assign({}, this.query);
                } else {
                    this.isCreate = true;
                    this.query = new Query();
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
            this.queryService.create(form.value)
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe((result) => {
                    this.saving = false;
                    this.router.navigateByUrl('queries');
                });
        } else {
            this.queryService.update(this.query.id, form.value)
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe((result) => {
                    this.saving = false;
                    this.original = Object.assign({}, this.query);
                    if (form && form.form) {
                        form.form.markAsPristine();
                    }
                    this.router.navigateByUrl('queries');
                });
        }
    }

    cancel(form: NgForm) {
        if (this.isCreate) {
            this.router.navigateByUrl('queries');
        } else {
            this.query = Object.assign({}, new Query(this.original));
            form.form.markAsPristine();
        }
    }

    onDisplayNameChange(newDisplayName: string) {
        const snakeCasedDisplayName = _.snakeCase(newDisplayName);
        this.query.nameId = snakeCasedDisplayName;
    }

}

