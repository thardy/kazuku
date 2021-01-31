import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {AuthService} from '../../common/auth/auth.service';
import * as userActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {User} from '../../common/auth/user.model';

@Injectable()
export class UserEffects {
    constructor(private actions$: Actions,
                private userService: AuthService) {}

    // @Effect()
    // loginUser$ = this.actions$.pipe(
    //     ofType(userActions.UserActionTypes.USER_LOGIN),
    //     switchMap((action: userActions.LoginUser) => {
    //         console.log(action.payload);
    //         return this.authService.login(action.payload).pipe(
    //             map((user: User) => new userActions.LoginUserSuccess(user)),
    //             catchError(error => of(new userActions.LoginUserFailure(error)))
    //         );
    //     })
    // );

    // @Effect()
    // loginUserSuccess$ = this.actions$.pipe();


}
