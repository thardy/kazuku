import {Express} from 'express';
import {Db} from 'mongodb';

import {ApiController} from '#common/controllers/api.controller';
import {SiteService} from './site.service';
import {ISite} from './site.model';

export class SitesController extends ApiController<ISite> {
  siteService: SiteService;

  constructor(app: Express, db: Db) {
    const siteService = new SiteService(db);
    super('sites', app, siteService);
    this.siteService = siteService;
  }

  mapRoutes(app: Express) {
    super.mapRoutes(app); // map the base ApiController routes
  }


}
