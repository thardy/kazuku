import {Express} from 'express';
import {ApiController} from '#common/controllers/api.controller';
import {SiteService} from './site.service';
import database from '#server/database/database';
import {ISite} from '#features/sites/site.model';

export class SitesController extends ApiController<ISite> {
  siteService: SiteService;

  constructor(app: Express) {
    const siteService = new SiteService(database.db!);
    super('sites', app, siteService);
    this.siteService = siteService;
  }

  mapRoutes(app: Express) {
    super.mapRoutes(app); // map the base ApiController routes
  }


}
