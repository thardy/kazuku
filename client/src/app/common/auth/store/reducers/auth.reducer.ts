import {AuthActions, AuthActionTypes} from '../actions/auth.actions';
import {UserContext} from '../../user-context.model';

export const authFeatureKey = 'auth';

export interface State {
    userContext: UserContext;
    loading: boolean;
    loaded: boolean;
    errors: any;
}

export const initialState: State = {
    userContext: new UserContext({}),
    loading: false,
    loaded: false,
    errors: null
};

export function reducer(state = initialState, action: AuthActions): State {
    switch (action.type) {

        case AuthActionTypes.LoadUserContext: {
            return {
                ...state,
                loading: true
            }
        }

        case AuthActionTypes.LoadUserContextSuccess: {
            return {
                ...state,
                userContext: action.payload,
                loading: false
            }
        }

        case AuthActionTypes.LoadUserContextFailure: {
            return {
                ...state,
                loading: false,
                loaded: false,
                errors: action.payload
            }
        }

        default:
            return state;
    }
}
