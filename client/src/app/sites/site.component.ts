import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {ISite, Site} from './site.model';
import {BaseComponent} from '@common/base-component';
import {Observable} from 'rxjs';

import {tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.state';
import {SiteSelectors, SiteState} from './store';

@Component({
  selector: 'kz-site',
  templateUrl: './site.component.html'
})
export class SiteComponent extends BaseComponent implements OnInit {

    site$: Observable<ISite>;
    constructor(private route: ActivatedRoute, private store: Store<SiteState>) {
        super();
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.site$ = this.store.select(SiteSelectors.selectSiteById(id));
    }

}
