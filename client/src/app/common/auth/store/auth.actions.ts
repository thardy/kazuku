import { createAction, props } from '@ngrx/store';
import {IUserContext, UserContext} from '../user-context.model';

export const loginButtonClicked = createAction('[LoginComponent] Login Button Clicked');
export const userAuthenticatedWithIdentityProvider = createAction('[AppComponent] User Authenticated With Identity Provider');

export const selectOrgButtonClicked = createAction('[OrganizationListComponent] Select Org Button Clicked', props<{ orgId: string }>());
export const orgSelected = createAction('[AuthEffects] Org Selected', props<{ userContext: IUserContext }>());
export const selectOrgContextFailed = createAction('[AuthEffects] SelectOrgContext Failed', props<{ error: Error }>());

export const logoutButtonClicked = createAction('[HeaderComponent] Logout Button Clicked');
export const userLoggedOut = createAction('[AuthEffects] User Logged Out');
export const logoutFailed = createAction('[AuthEffects] Logout Failed', props<{ error: Error }>());

export const getUserContextFailed = createAction('[AuthEffects] GetUserContext Failed', props<{ error: Error }>());
export const userLoggedIn = createAction('[AuthEffects] User Logged In', props<{ userContext: IUserContext }>());


