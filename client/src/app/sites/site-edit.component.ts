import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {AppState} from '../store/app.state';
import {ISite, Site} from './site.model';
import {SiteActions} from './store';

@Component({
    selector: 'site-edit',
    templateUrl: './site-edit.component.html',
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
            name: ['', Validators.required],
            code: ['', Validators.required],
            domain: [''],
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
        const mergedSite: ISite = {
            ...this.site,
            ...formValue
        };

        const site = new Site(mergedSite);
        // ngRx does not allow objects with their own constructors when strict serializability is turned on!!!!!
        const serializableSite = {...site};

        if (this.mode === 'create') {
            this.store.dispatch(SiteActions.createSiteButtonClicked({site: serializableSite}));
        }
        else if (this.mode === 'update') {
            this.store.dispatch(SiteActions.updateSiteButtonClicked({site: serializableSite}));
        }

        this.formClosed.emit();
    }

    onDelete(site: ISite) {
        this.store.dispatch(SiteActions.deleteSiteButtonClicked({site: {...site}}));
    }

}
