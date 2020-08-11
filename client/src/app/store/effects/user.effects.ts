import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {UserService} from '../../users/user.service';
import * as userActions from '../actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {User} from '../../users/user.model';

@Injectable()
export class UserEffects {
    constructor(private actions$: Actions,
                private userService: UserService) {}

    // @Effect()
    // loginUser$ = this.actions$.pipe(
    //     ofType(userActions.UserActionTypes.USER_LOGIN),
    //     switchMap((action: userActions.LoginUser) => {
    //         console.log(action.payload);
    //         return this.userService.login(action.payload).pipe(
    //             map((user: User) => new userActions.LoginUserSuccess(user)),
    //             catchError(error => of(new userActions.LoginUserFailure(error)))
    //         );
    //     })
    // );

    // @Effect()
    // loginUserSuccess$ = this.actions$.pipe();


}
