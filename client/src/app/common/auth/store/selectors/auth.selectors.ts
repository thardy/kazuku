import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from '../reducers/auth.reducer';

export const selectAuthState = createFeatureSelector<fromAuth.State>(
  fromAuth.authFeatureKey
);

export const getAuthorizedUserContext = createSelector(
    selectAuthState,
    (state) => state.userContext
);

export const getUserContextLoading = createSelector(
    selectAuthState,
    (state: any) => state.loading
);
