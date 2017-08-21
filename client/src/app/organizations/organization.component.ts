import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BaseComponent} from "../common/base-component";
import {Organization} from "./organization.model";
import {OrganizationService} from "./organization.service";
import {NgForm} from "@angular/forms";
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'kz-organization',
  templateUrl: './organization.component.html'
})
export class OrganizationComponent extends BaseComponent implements OnInit {

    organization: Organization = new Organization();
    saving = false;
    original = {};
    orgId: string;
    isCreate = false;

    constructor(private route: ActivatedRoute, private orgService: OrganizationService, private router: Router) {
        super();
    }

    ngOnInit() {
        this.route.params
            .flatMap((params:Params) => {
                const id = params['id'] || '';
                if (id) {
                    this.orgId = id;
                    return this.orgService.getById(this.orgId);
                }
                else {
                    return Observable.of(null);
                }
            })
            .subscribe((org) => {
                if (org) {
                    this.organization = org;
                    this.original = Object.assign({}, this.organization);
                }
                else {
                    this.isCreate = true;
                    this.organization = new Organization();
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
            this.orgService.create(form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result) => {
                    this.saving = false;
                    this.router.navigateByUrl('organizations');
                });
        }
        else {
            this.orgService.update(this.orgId, form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result) => {
                    this.saving = false;
                    this.original = Object.assign({}, this.organization);
                    form.form.markAsPristine();
                });
        }
    }

    cancel(form: NgForm){
        if (this.isCreate) {
            this.router.navigateByUrl('organizations');
        }
        else {
            this.organization = Object.assign({}, new Organization(this.original));
            form.form.markAsPristine();
        }
    }

}
