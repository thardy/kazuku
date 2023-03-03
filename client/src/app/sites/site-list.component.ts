import {Component, OnInit} from '@angular/core';
import {ISite, Site} from './site.model';
import {SiteActions, SiteSelectors} from './store';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.state';
import {Observable} from 'rxjs';

@Component({
    selector: 'kz-site-list',
    templateUrl: './site-list.component.html'
})
export class SiteListComponent implements OnInit {
    sites$: Observable<ISite[]> = this.store.select(SiteSelectors.selectAllSites);
    loading$: Observable<boolean> = this.store.select(SiteSelectors.isLoading);
    loaded$: Observable<boolean> = this.store.select(SiteSelectors.isLoaded);
    editing = false;
    adding = false;
    selectedSite: ISite;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit() {
        this.store.dispatch(SiteActions.siteListComponentOpened());
    }

    onEdit(site: ISite) {
        this.selectedSite = {...site};
        this.editing = true;
    }

    onAdd() {
        this.adding = true;
    }

    onDelete(site: ISite) {
        this.store.dispatch(SiteActions.deleteSiteButtonClicked({ site }));
    }

    onFormClosed() {
        this.selectedSite = null;
        this.editing = false;
        this.adding = false;
    }

}
