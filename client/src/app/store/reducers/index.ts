import {UserState} from '../models/app_state.models';
import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';

import * as fromUser from './user.reducer';

export interface ApplicationState {
    user: UserState;
}

export const reducers: ActionReducerMap<ApplicationState> = {
    user: fromUser.userReducer
}

export const getUserState = createFeatureSelector<UserState>('user');
