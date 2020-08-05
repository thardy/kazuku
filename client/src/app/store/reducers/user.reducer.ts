import {INITIAL_STATE, UserState} from '../models/app_state.models';
import * as userActions from '../actions';
import {UserActionTypes} from '../actions';

export function userReducer(state: UserState = INITIAL_STATE, action: userActions.UserActions): UserState {

    switch (action.type) {
        case userActions.UserActionTypes.USER_LOGIN:
            return {
                ...state,
                loading: true
            };

        case UserActionTypes.USER_LOGIN_SUCCESS:
            console.log(action.payload);
            const userInfo = action.payload;
            return {
                ...state,
                loading: false,
                loaded: true,
                user: userInfo
            };

        case UserActionTypes.USER_LOGIN_FAILURE:
            const error = action.payload;
            return {
                ...state,
                loading: false,
                loaded: false,
                errors: error
            }
    }

    return state;
}

export const getUser = (state: UserState) => state.user;
export const getUserLoading = (state: UserState) => state.loading;
export const getUserLoaded = (state: UserState) => state.loaded;
