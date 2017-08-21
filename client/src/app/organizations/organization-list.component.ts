import { Component, OnInit } from '@angular/core';
import {Organization} from "./organization.model";
import {OrganizationService} from "./organization.service";
import {Router} from "@angular/router";

@Component({
  selector: 'kz-organization-list',
  templateUrl: './organization-list.component.html'
})
export class OrganizationListComponent implements OnInit {

    organizations: Organization[] = [];

    constructor(private organizationService: OrganizationService, private router: Router) {
    }

    ngOnInit() {
        this.organizationService.getAll()
            .subscribe((organizations) => {
                this.organizations = organizations;
            });
    }

    create() {
        this.router.navigateByUrl('organizations/create');
    }

}
