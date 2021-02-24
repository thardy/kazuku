import {Action} from '@ngrx/store';
import {UserContext} from '../../user-context.model';

export enum AuthActionTypes {
    LoadUserContext = '[Auth] Load User Context',
    LoadUserContextSuccess = '[Auth] Load User Context Success',
    LoadUserContextFailure = '[Auth] Load User Context Failure',
}

export class LoadUserContext implements Action {
    readonly type = AuthActionTypes.LoadUserContext;
}

export class LoadUserContextSuccess implements Action {
    readonly type = AuthActionTypes.LoadUserContextSuccess;

    constructor(public payload: UserContext) {}
}

export class LoadUserContextFailure implements Action {
    readonly type = AuthActionTypes.LoadUserContextFailure;

    constructor(public payload: any | null) {}
}

export type AuthActions =
    LoadUserContext |
    LoadUserContextSuccess |
    LoadUserContextFailure;

