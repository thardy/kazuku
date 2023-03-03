import {createFeatureSelector, createSelector} from '@ngrx/store';
import {sitesFeatureKey, SiteState, selectAll, selectEntities, selectIds, selectTotal} from './site.reducer';

export const selectSiteState = createFeatureSelector<SiteState>(sitesFeatureKey);

export const selectAllSites = createSelector(
    selectSiteState,
    selectAll
);

export const selectSiteById = (id: string) => createSelector(
    selectSiteState,
    (sites) => {
        return sites.entities[id];
    }
);

export const isLoading = createSelector(
    selectSiteState,
    state => state.loading
);

export const isLoaded = createSelector(
    selectSiteState,
    state => state.loaded
);
