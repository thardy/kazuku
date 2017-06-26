import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Site} from "./site.model";
import {SiteService} from "./sites.service";

@Component({
  selector: 'kz-site-detail',
  templateUrl: './site-detail.component.html',
  styleUrls: ['./site-detail.component.less']
})
export class SiteDetailComponent implements OnInit {

    site: Site = new Site();

    constructor(private route: ActivatedRoute, private siteService: SiteService) {
    }

    ngOnInit() {
        this.route.params
            .flatMap((params:Params) => {
                let id = params['id'] || 0;
                return this.siteService.getById(id)
            })
            .subscribe((site) => {
                this.site = site;
            });
    }

}
