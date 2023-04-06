import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {compareSites, ISite} from '../site.model';
import * as SiteActions from './site.actions';
import NgrxUtils from '@common/utils/ngrx.utils';

export const sitesFeatureKey = 'sites';

export interface SiteState extends EntityState<ISite> {
    loading: boolean,
    loaded: boolean
}

// since we are using NgRx's Entity module (great for collections of things), we create an adapter - a helper that makes it easier
//  to add, update, and remove items from the collection.
// https://blog.angular-university.io/ngrx-entity/ tl;dr Entity provides an efficient means of storing a collection of items, allowing
//  fast lookups by key and efficient sorting via an array.
export const adapter = createEntityAdapter<ISite>({
    sortComparer: compareSites,
    //selectId: site => site.name // this is where you would override your distinct id if it's not 'id'. If you have an id though, use it.
});

const initialSiteState = adapter.getInitialState({
    loading: false,
    loaded: false
});

export const siteReducer = createReducer(
    { ...initialSiteState },

    // this assumes we always call the api to load sites when the list component is opened. If we change to conditionally
    //  load, we can put the condition in a utility or service and use that condition here and in the effect.
    on(SiteActions.siteListComponentOpened, (state, action) => {
        return { ...state, loading: true }
    }),

    on(SiteActions.sitesLoaded, (state, action) => {
        return adapter.setAll(action.sites,
            {...state, loading: false, loaded: true});
    }),

    on(SiteActions.siteCreated, (state, { site }) => {
        return adapter.addOne(site, state);
    }),

    on(SiteActions.siteUpdated, (state, { site }) => {
        const update = NgrxUtils.getUpdateObjectFor(site);
        return adapter.updateOne(update, state);
    }),

    on(SiteActions.siteDeleted, (state, { site }) => {
        return adapter.removeOne(site.id, state);
    }),

);

export const {
    selectAll, selectEntities, selectIds, selectTotal
} = adapter.getSelectors();
