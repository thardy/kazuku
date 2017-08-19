import { Component, OnInit } from '@angular/core';
import {Organization} from "./organization.model";
import {OrganizationService} from "./organization.service";

@Component({
  selector: 'kz-organization-list',
  templateUrl: './organization-list.component.html'
})
export class OrganizationListComponent implements OnInit {

    organizations: Organization[] = [];

    constructor(private organizationService: OrganizationService) {
    }

    ngOnInit() {
        this.organizationService.getAll()
            .subscribe((organizations) => {
                this.organizations = organizations;
            });
    }

}
