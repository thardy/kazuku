import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {map, switchMap} from 'rxjs/operators';
import {AuthActionTypes, AuthActions} from '../actions/auth.actions';
import {AuthService} from '../../auth.service';

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions<AuthActions>,
              private authService: AuthService) {}

}
