import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BaseComponent} from "../common/base-component";
import {Query} from "./query.model";
import {QueryService} from "./query.service";
import {NgForm} from "@angular/forms";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

@Component({
    selector: 'kz-query',
    templateUrl: './query.component.html'
})
export class QueryComponent extends BaseComponent implements OnInit {

    query: Query = new Query();
    saving = false;
    original = {};
    queryId: string;
    isCreate = false;

    constructor(private route: ActivatedRoute, private queryService: QueryService, private router: Router) {
        super();
    }

    ngOnInit() {
        this.route.params
            .flatMap((params:Params) => {
                const id = params['id'] || '';
                if (id) {
                    this.queryId = id;
                    return this.queryService.getById(this.queryId);
                }
                else {
                    return Observable.of(null);
                }
            })
            .subscribe((query) => {
                if (query) {
                    this.query = query;
                    this.original = Object.assign({}, this.query);
                }
                else {
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
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result) => {
                    this.saving = false;
                    this.router.navigateByUrl('queries');
                });
        }
        else {
            this.queryService.update(this.queryId, form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result) => {
                    this.saving = false;
                    this.original = Object.assign({}, this.query);
                    form.form.markAsPristine();
                });
        }
    }

    cancel(form: NgForm){
        if (this.isCreate) {
            this.router.navigateByUrl('queries');
        }
        else {
            this.query = Object.assign({}, new Query(this.original));
            form.form.markAsPristine();
        }
    }

}

