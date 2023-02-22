import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {compareSites, ISite} from '../site.model';
import {SiteActions} from './index';
import NgrxUtils from '@common/utils/ngrx.utils';

export interface SiteState extends EntityState<ISite> {
    loading: boolean,
    loaded: boolean
}

// since we are using NgRx's Entity module (great for collections of things), we create an adapter - a helper that makes it easier
//  to add, update, and remove items from the collection.
// https://blog.angular-university.io/ngrx-entity/ tl;dr Entity provides an efficient means of storing a collection of items, allowing
//  fast lookups by key, and efficient sorting.
export const siteEntityAdapter = createEntityAdapter<ISite>({
    sortComparer: compareSites,
    //selectId: site => site.name // this is where you would override your distinct id if it's not 'id'. If you have an id though, use it.
});

const initialSiteState = siteEntityAdapter.getInitialState({
    loading: false,
    loaded: false
});

export const authReducer = createReducer(
    { ...initialSiteState },

    on(SiteActions.siteCreated, (state, { site }) => {

        return siteEntityAdapter.addOne(site, state);
    }),

    on(SiteActions.siteUpdated,(state, { site }) => {
        const update = NgrxUtils.getUpdateObjectFor(site);
        return siteEntityAdapter.updateOne(update, state);
    }),

    on(SiteActions.siteDeleted,(state, { site }) => {
        return siteEntityAdapter.removeOne(site.id, state);
    }),


);
