import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Organization} from "./organization.model";
import {OrganizationService} from "./organization.service";

@Component({
  selector: 'kz-organization-detail',
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.less']
})
export class OrganizationDetailComponent implements OnInit {

    organization: Organization = new Organization();

    constructor(private route: ActivatedRoute, private orgService: OrganizationService) {
    }

    ngOnInit() {
        this.route.params
            .flatMap((params:Params) => {
                let id = params['id'] || 0;
                return this.orgService.getById(id)
            })
            .subscribe((org) => {
                this.organization = org;
            });
    }

}
