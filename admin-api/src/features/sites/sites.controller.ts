import {Express} from 'express';
import {CrudController} from '../../common/controllers/crud.controller';
import {SiteService} from './site.service';
import database from '../../database/database';

export class SitesController extends CrudController<any> {
  siteService: SiteService;

  constructor(app: Express) {
    const siteService = new SiteService(database.db!);
    super('sites', app, siteService);
    this.siteService = siteService;
  }

  mapRoutes(app: Express) {
    super.mapRoutes(app); // map the base CrudController routes
  }

  someFunction() {
    this.siteService.getAll('1');
  }
}
