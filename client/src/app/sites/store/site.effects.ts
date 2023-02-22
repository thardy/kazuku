import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of as observableOf} from 'rxjs';
import {SiteService} from '../site.service';
import {SiteActions} from './index';

@Injectable()
export class Siteffects {
    constructor(private actions$: Actions,
                private siteService: SiteService,
                private store: Store) {}

    getUserContextOnAuthentication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SiteActions.siteListComponentOpened),
            switchMap((action) => {
                return this.siteService.getAll()
                    .pipe(
                        map((sites) => SiteActions.sitesLoaded({ sites })),
                        catchError((error) => {
                            return observableOf(SiteActions.getAllSitesFailed({ error }));
                        })
                    );
            }),
        )
    );

    createSite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SiteActions.createSiteButtonClicked),
            switchMap((action) => {
                return this.siteService.create(action.site)
                    .pipe(
                        map((site) => SiteActions.siteCreated({ site })),
                        catchError((error) => {
                            return observableOf(SiteActions.createSiteFailed({ error }));
                        })
                    );
            }),
        )
    );

    updateSite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SiteActions.updateSiteButtonClicked),
            switchMap((action) => {
                // todo: create a helper to handle the Update that NgRx Entities wants (I'd rather our services not have to deal with it)
                return this.siteService.update(action.site.id, action.site)
                    .pipe(
                        map((site) => {
                            return SiteActions.siteUpdated({ site })
                        }),
                        catchError((error) => {
                            return observableOf(SiteActions.updateSiteFailed({ error }));
                        })
                    );
            }),
        )
    );

    deleteSite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SiteActions.deleteSiteButtonClicked),
            switchMap((action) => {
                // todo: create a helper to handle the Update that NgRx Entities wants (I'd rather our services not have to deal with it)
                return this.siteService.delete(action.site)
                    .pipe(
                        map((site) => SiteActions.siteDeleted({ site })),
                        catchError((error) => {
                            return observableOf(SiteActions.deleteSiteFailed({ error }));
                        })
                    );
            }),
        )
    );
}
