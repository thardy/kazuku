import {Component, OnInit} from '@angular/core';
import {Query} from "./query.model";
import {QueryService} from "./query.service";
import {Router} from "@angular/router";

@Component({
    selector: 'kz-query-list',
    templateUrl: './query-list.component.html'
})
export class QueryListComponent implements OnInit {

    queries: Query[] = [];

    constructor(private queryService: QueryService, private router: Router) {
    }

    ngOnInit() {
        this.queryService.getAll()
            .subscribe((queries) => {
                this.queries = queries;
            });
    }

    create() {
        this.router.navigateByUrl('queries/create');
    }

}
