import { createSelector } from '@ngrx/store';
import { AppState } from '../../../store/app.state';


export const selectUserContext = (state: AppState) => state.auth;

export const selectIsAuthenticated = createSelector(selectUserContext, (state) => state?.isAuthenticated);
