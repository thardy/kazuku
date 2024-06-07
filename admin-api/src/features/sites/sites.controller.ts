import {Express} from 'express';
import {ApiController} from '#common/controllers/api.controller';
import {SiteService} from './site.service';
import {ISite} from '#features/sites/site.model';
import {Db} from 'mongodb';

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
