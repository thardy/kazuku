import {createAction, props} from '@ngrx/store';
import {ISite} from '../site.model';

export const siteListComponentOpened = createAction('[SiteListComponent] Opened');
export const sitesLoaded = createAction('[SiteEffects] Sites Loaded', props<{sites: ISite[]}>());
export const getAllSitesFailed = createAction('[SiteEffects] GetAllSites Failed', props<{ error: Error }>());

export const createSiteButtonClicked = createAction('[SiteListComponent] CreateSiteButton Clicked', props<{site: ISite}>());
export const siteCreated = createAction('[SiteEffects] Site Created', props<{site: ISite}>());
export const createSiteFailed = createAction('[SiteEffects] Create Site Failed', props<{ error: Error }>());

export const updateSiteButtonClicked = createAction('[SiteEditComponent] UpdateSiteButton Clicked', props<{site: ISite}>());
export const siteUpdated = createAction('[SiteEffects] Site Updated', props<{site: ISite}>());
export const updateSiteFailed = createAction('[SiteEffects] Update Site Failed', props<{ error: Error }>());

export const deleteSiteButtonClicked = createAction('[SiteEditComponent] DeleteSiteButton Clicked', props<{site: ISite}>());
export const siteDeleted = createAction('[SiteEffects] Site Deleted', props<{site: ISite}>());
export const deleteSiteFailed = createAction('[SiteEffects] Delete Site Failed', props<{ error: Error }>());

