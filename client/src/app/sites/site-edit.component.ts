import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Update} from '@ngrx/entity';

@Component({
    selector: 'site-edit',
    templateUrl: './site-edit.component.html',
    styleUrls: ['./site-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteEditComponent implements OnInit {
    @Input() site: ISite;
    @Input() mode: 'create' | 'update';
    @Output() formClosed = new EventEmitter();
    form: FormGroup;
    dialogTitle: string;
    loading$: Observable<boolean>;

    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>
    ) {

    }

    ngOnInit(): void {
        const formControls = {
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            age: [0, Validators.required],
            birthdate: [''],
        };

        if (this.mode === 'update') {
            this.form = this.fb.group(formControls);
            this.form.patchValue({...this.site});
        }
        else if (this.mode === 'create') {
            this.form = this.fb.group({
                ...formControls
            });
        }
    }

    onCancel() {
        this.formClosed.emit();
    }

    onSave() {
        const formValue = this.form.value;
        if (formValue && formValue.age) {
            const age = parseInt(formValue.age, 10);
            if (age) {
                formValue.age = age;
            }
        }

        const mergedSite: ISite = {
            ...this.site,
            ...formValue
        };

        const site = new Site(mergedSite);
        // ngRx does not allow objects with their own constructors when strict serializability is turned on!!!!!
        const serializableSite = {...site};

        // const update: Update<ISite> = {
        //   id: site.id,
        //   changes: serializableSite
        // };

        if (this.mode === 'create') {
            //this.store.dispatch(SiteActions.createSite({site: serializableSite}));
            this.store.dispatch(SiteActions.createSite({site: serializableSite}));
        }
        else if (this.mode === 'update') {
            //this.store.dispatch(SiteActions.updateSite({site: serializableSite}));
            this.store.dispatch(SiteActions.updateSite({site: serializableSite}));
        }

        this.formClosed.emit();
    }

    onDelete(site: ISite) {
        //this.store.dispatch(SiteActions.deleteSite({site: {...site}}));
        this.store.dispatch(SiteActions.deleteSite({site: {...site}}));
    }

}
