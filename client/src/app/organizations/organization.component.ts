import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {BaseComponent} from "../common/base-component";
import {Organization} from "./organization.model";
import {OrganizationService} from "./organization.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'kz-organization',
  templateUrl: './organization.component.html'
})
export class OrganizationComponent extends BaseComponent implements OnInit {

    organization: Organization = new Organization();
    saving = false;
    originalValues = {};
    orgId: string;

    constructor(private route: ActivatedRoute, private orgService: OrganizationService) {
        super();
    }

    ngOnInit() {
        this.route.params
            .flatMap((params:Params) => {
                const id = params['id'] || '';
                this.orgId = id;
                return this.orgService.getById(this.orgId);
            })
            .subscribe((org) => {
                this.organization = org;
                this.originalValues = { 'name': org.name, 'code': org.code };
            });
    }

    submitForm(form: NgForm) {
        // validate form
        if (!form.valid) {
            return;
        }

        this.saving = true;
        this.organization.name = form.value.name;
        this.organization.code = form.value.code;
        this.originalValues = {'name': this.organization.name, 'code': this.organization.code};
        this.orgService.update(this.organization)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((result) => {
                this.saving = false;
                form.form.markAsPristine();
            });
    }

    cancel(form: NgForm){
        this.organization.name = this.originalValues['name'];
        this.organization.code = this.originalValues['code'];
        form.form.markAsPristine();
    }

}
