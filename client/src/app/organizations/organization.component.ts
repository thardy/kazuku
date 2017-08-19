import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Organization} from "./organization.model";
import {OrganizationService} from "./organization.service";
import {NgForm} from "@angular/forms";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'kz-organization',
  templateUrl: './organization.component.html'
})
export class OrganizationComponent implements OnInit, OnDestroy {

    organization: Organization = new Organization();
    saving = false;
    originalValues = {};
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(private route: ActivatedRoute, private orgService: OrganizationService) {
    }

    ngOnInit() {
        this.route.params
            .flatMap((params:Params) => {
                let id = params['id'] || 0;
                return this.orgService.getById(id);
            })
            .subscribe((org) => {
                this.organization = org;
                this.originalValues = { 'name': org.name, 'code': org.code };
            });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    submitForm(form: NgForm) {
        // validate form
        if (!form.valid) {
            return;
        }

        this.saving = true;
        const org = new Organization(form.value);
        this.orgService.update(org)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
                org => {
                    this.organization = org;
                    this.originalValues = {'name': org.name, 'code': org.code};
                    this.saving = false;
                    form.form.markAsPristine();
                },
                err => {
                    console.log('error: ', err);
                }
            );
    }

    cancel(form: NgForm){
        this.organization.name = this.originalValues['name'];
        this.organization.code = this.originalValues['code'];
        form.form.markAsPristine();
    }

}
