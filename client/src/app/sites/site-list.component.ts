import {Component, OnInit} from '@angular/core';
import {Site} from "./site.model";
import {SiteService} from "./sites.service";

@Component({
  selector: 'kz-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.less']
})
export class SiteListComponent implements OnInit {

    // todo: alter to use orgId of the logged-in user.  Only return sites for the logged-in user
    sites: Site[] = [];

    constructor(private siteService: SiteService) {
    }

    ngOnInit() {
        this.siteService.getAll()
            .subscribe((sites) => {
                this.sites = sites;
            });
    }
}
