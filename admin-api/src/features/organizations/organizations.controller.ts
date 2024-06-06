import {ApiController} from '@common/controllers/api.controller';
import {Express, NextFunction, Request, Response} from 'express';
import database from '@server/database/database';
import {IOrganization} from '@common/models/organization.model';
import {OrganizationService} from '@features/organizations/organization.service';
import {isAuthenticated} from '@server/middleware/is-authenticated';

/**
 * OrganizationsController is unique, just like its service, because Organizations are not multi-tenant
 * entities, requiring an orgId in addition to its primary key id. The primary key is the orgId.
 */
export class OrganizationsController extends ApiController<IOrganization> {
  orgService: OrganizationService;

  constructor(app: Express) {
    const orgService = OrganizationService.getInstance(database.db!);
    super('organizations', app, orgService);
    this.orgService = orgService;
  }

  override mapRoutes(app: Express) {
    super.mapRoutes(app); // map the base ApiController routes

    app.get(`/api/${this.resourceName}/getbyname/:name`, isAuthenticated, this.getByName.bind(this));
    app.get(`/api/${this.resourceName}/getbycode/:code`, isAuthenticated, this.getByCode.bind(this));
  }

  override async getAll(req: Request, res: Response, next: NextFunction) {
    console.log('in OrganizationController.getAll');
    try {
      res.set('Content-Type', 'application/json');
      const entities = await this.orgService.getAll();
      return res.status(200).json(entities);
    }
    catch (error) {
      next(error);
    }
  }

  override async getById(req: Request, res: Response, next: NextFunction) {
    console.log('in OrganizationController.getById');
    let id = req.params?.id;
    try {
      res.set('Content-Type', 'application/json');
      const entity = await this.orgService.getOrgById(id);
      if (entity === null) return next();

      return res.status(200).send(entity);
    }
    catch (err: any) {
      next(err);
    }
  }

  async getByName(req: Request, res: Response, next: NextFunction) {
    console.log('in OrganizationController.getByName');
    let name = req.params?.name;
    try {
      res.set('Content-Type', 'application/json');
      const entity = await this.orgService.findOne({name: name});
      if (entity === null) return next();

      return res.status(200).send(entity);
    }
    catch (err: any) {
      next(err);
    }
  }

  async getByCode(req: Request, res: Response, next: NextFunction) {
    console.log('in OrganizationController.getByCode');
    let code = req.params?.code;
    try {
      res.set('Content-Type', 'application/json');
      const entity = await this.orgService.findOne({code: code});
      if (entity === null) return next();

      return res.status(200).send(entity);
    }
    catch (err: any) {
      next(err);
    }
  }

  override async create(req: Request, res: Response, next: NextFunction) {
    console.log('in OrganizationController.create');
    const entity = await this.orgService.create(req.userContext!, req.body);
    return res.status(201).json(entity);
  }

  override async updateById(req: Request, res: Response, next: NextFunction) {
    console.log('in OrganizationController.updateById');
    const entity = await this.orgService.updateById(req.userContext!, req.params.id, req.body);
    return res.status(200).json(entity);
  }

  override async deleteById(req: Request, res: Response, next: NextFunction) {
    console.log('in OrganizationController.deleteById');
    const deleteResult = await this.orgService.deleteById(req.userContext!, req.params.id)
    return res.status(200).json(deleteResult);
  }

}
