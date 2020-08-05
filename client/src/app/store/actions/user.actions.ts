import {Action} from '@ngrx/store';
import {User, UserEmailLoginInformation} from '../../users/user.model';

export enum UserActionTypes {
    USER_LOGIN = '[User] Login',
    USER_LOGIN_SUCCESS = '[User] Login Success',
    USER_LOGIN_FAILURE = '[User] Login Failure',
}

export class LoginUser implements Action {
    readonly type = UserActionTypes.USER_LOGIN;
    constructor(public payload: UserEmailLoginInformation) {
        console.log(payload);
    }
}

export class LoginUserSuccess implements Action {
    readonly type = UserActionTypes.USER_LOGIN_SUCCESS;

    constructor(public payload: User) {
    }
}

export class LoginUserFailure implements Action {
    readonly type = UserActionTypes.USER_LOGIN_FAILURE;

    constructor(public payload: any) {
    }
}

export type UserActions =
    | LoginUser
    | LoginUserSuccess
    | LoginUserFailure;
