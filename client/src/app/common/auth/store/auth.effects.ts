import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of as observableOf, throwError as observableThrowError, withLatestFrom} from 'rxjs';
import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';
import {AuthService} from '../auth.service';
import {catchError, filter, map, switchMap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {UserContext} from '../user-context.model';

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions,
                private authService: AuthService,
                private store: Store) {}

    getUserContextOnAuthentication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.userAuthenticatedWithIdentityProvider),
            switchMap((action) => {
                return this.authService.getUserContext()
                    .pipe(
                        map((userContext) => AuthActions.userLoggedIn({ userContext: userContext.serialize() })),
                        catchError((error) => {
                            return observableOf(AuthActions.getUserContextFailed({ error }));
                        })
                    );
            }),
        )
    );

    logoutUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logoutButtonClicked),
            switchMap((action) => {
                return this.authService.logout()
                    .pipe(
                        map((user) => AuthActions.userLoggedOut()),
                        catchError((error) => {
                            return observableOf(AuthActions.logoutFailed({ error }));
                        })
                    );
            }),
        )
    );

    selectOrgContext$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.selectOrgButtonClicked),
            switchMap((action) => {
                return this.authService.selectOrgContext(action.orgId)
                    .pipe(
                        map((userContext) => AuthActions.orgSelected({ userContext: userContext.serialize() })),
                        catchError((error) => {
                            return observableOf(AuthActions.selectOrgContextFailed({error}));
                        })
                    );
            }),
        )
    );

}
