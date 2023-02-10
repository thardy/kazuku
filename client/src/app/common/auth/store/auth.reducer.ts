// **** Evaluation module state *************************
import {createReducer, on} from '@ngrx/store';
import * as AuthActions from './auth.actions';
import {UserContext} from '../user-context.model';

const initialAuthState = {
    user: null,
    org: null,
    isAuthenticated: false
};

export const authReducer = createReducer(
    { ...initialAuthState },

    on(AuthActions.userLoggedIn, (state, { userContext }) => {
        return { ...state, ...userContext, isAuthenticated: true };
    }),
    on(AuthActions.userLoggedOut, (state, action) => {
        return { ...state, ...initialAuthState };
    }),

);
