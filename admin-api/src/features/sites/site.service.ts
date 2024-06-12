import {Db} from 'mongodb';

import {GenericApiService} from '#common/services/generic-api.service';
import {ISite, Site} from './site.model';

export class SiteService extends GenericApiService<ISite> {
  constructor(db: Db) {
    super(db, 'sites', 'site');
  }

  override validate(entity: ISite) {
    return Site.validationSchema.validate(entity, {abortEarly: false});
  }
}
