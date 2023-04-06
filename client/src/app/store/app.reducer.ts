// These property names have to match AppState property names
import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {AppState} from './app.state';
import {authReducer} from '@common/auth/store';

export const appReducer: ActionReducerMap<AppState> = {
    auth: authReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [];
// example of a metaReducer (basically just something that happens on every action)...
// export const metaReducer: MetaReducer<AppState>[] = !environment.production ? [logger] : [];

// export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
//   return (state, action) => {
//     console.log('state before: ', state);
//     console.log('action', action);
//
//     return reducer(state, action);
//   };
// }

