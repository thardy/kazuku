import {Component, OnInit} from '@angular/core';
import {Site} from "./site.model";
import {SiteService} from "./site.service";
import {Router} from "@angular/router";

@Component({
    selector: 'kz-site-list',
    templateUrl: './site-list.component.html'
})
export class SiteListComponent implements OnInit {

    sites: Site[] = [];
    loading = true;

    constructor(private siteService: SiteService, private router: Router) {
    }

    ngOnInit() {
        this.siteService.getAll()
            .subscribe(
                (sites) => {
                    this.sites = sites;
                    this.loading = false;
                },
                (error) => {
                    this.loading = false;
                }
            );
    }

    create() {
        this.router.navigateByUrl('sites/create');
    }

}
