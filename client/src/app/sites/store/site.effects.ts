import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {catchError, combineLatestWith, delay, map, switchMap} from 'rxjs/operators';
import {of as observableOf} from 'rxjs';
import {SiteService} from '../site.service';
import {SiteActions} from './index';

@Injectable()
export class SiteEffects {
    constructor(private actions$: Actions,
                private siteService: SiteService,
                private store: Store) {}

    getAllSites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SiteActions.siteListComponentOpened),
            switchMap((action) => {
                return this.siteService.getAll()
                    .pipe(
                        delay(3000),
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
                return this.siteService.delete(action.site.id)
                    .pipe(
                        combineLatestWith(observableOf(action)),
                        // we return the site from the action because the api doesn't return anything on success
                        map(([deleteResult, action]) => SiteActions.siteDeleted({ site: action.site })),
                        catchError((error) => {
                            return observableOf(SiteActions.deleteSiteFailed({ error }));
                        })
                    );
            }),
        )
    );
}
