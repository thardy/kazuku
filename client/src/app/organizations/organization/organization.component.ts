import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {BaseComponent} from '@common/base-component';
import {Organization} from '@common/auth/organization.model';
import {OrganizationService} from '../shared/organization.service';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {iif, Observable, of} from 'rxjs';
import {filter, mergeMap, share, switchMap, takeUntil, tap} from 'rxjs/operators';

@Component({
    selector: 'kz-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.less']
})
export class OrganizationComponent extends BaseComponent implements OnInit {
    organizationForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        code: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required)
    });

    orgDetails$: Observable<Organization>;

    // organization: Organization = new Organization();
    // saving = false;
    // original = {};
    // orgId: string;
    // isCreate = false;

    constructor(private route: ActivatedRoute,
                private orgService: OrganizationService,
                private router: Router) {
        super();
    }

    ngOnInit() {
        this.orgDetails$ = this.route.paramMap.pipe(
            mergeMap((params: ParamMap) => iif(() => params.has('id'), this.orgService.getById(params.get('id')), of(new Organization()) ) )
        );

        this.orgDetails$.pipe(
            filter((organization: Organization) => organization.id !== ''),
            share()
        ).subscribe((organization: Organization) => {
            console.log(organization);
            this.organizationForm.patchValue({
                name: organization.name,
                code: organization.code,
                description: organization.description
            });
            this.organizationForm.markAsUntouched({onlySelf: true});
        });
    }

    save() {
        console.log(this.organizationForm.value);
        // validate form
        // if (!form.valid) {
        //     return;
        // }
        //
        // this.saving = true;
        //
        // if (this.isCreate) {
        //     this.orgService.create(form.value)
        //         .pipe(
        //             takeUntil(this.ngUnsubscribe)
        //         )
        //         .subscribe((result) => {
        //             this.saving = false;
        //             this.router.navigateByUrl('organizations');
        //         });
        // } else {
        //     this.orgService.update(this.orgId, form.value)
        //         .pipe(
        //             takeUntil(this.ngUnsubscribe)
        //         )
        //         .subscribe((result) => {
        //             this.saving = false;
        //             this.original = Object.assign({}, this.organization);
        //             form.form.markAsPristine();
        //         });
        // }
    }

    cancel() {
        this.router.navigateByUrl('organizations');
        // if (!this.organization.id) {
        //     this.router.navigateByUrl('organizations');
        // } else {
        //     this.organization = Object.assign({}, new Organization(this.original));
        //     this.organizationForm.markAsPristine();
        // }
    }

}
