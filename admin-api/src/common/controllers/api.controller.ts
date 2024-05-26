import {Express, NextFunction, Request, Response} from 'express';
import {GenericApiService} from '../services/generic-api.service';
import {IGenericApiService} from '../services/generic-api-service.interface';
import {User} from '../models/user.model';
import {IMultiTenantEntity} from '@common/models/multi-tenant-entity.interface';
import {isAuthenticated} from '@server/middleware/is-authenticated';

export abstract class ApiController<T extends IMultiTenantEntity> {
  protected app: Express;
  protected service: IGenericApiService<T>;
  protected resourceName: string;

  protected constructor(resourceName: string, app: Express, service: IGenericApiService<T>) {
    this.app = app;
    this.service = service;
    this.resourceName = resourceName;

    this.mapRoutes(app);
  }

  mapRoutes(app: Express) {
    // Map routes
    // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
    app.get(`/api/${this.resourceName}`, isAuthenticated, this.getAll.bind(this));
    app.get(`/api/${this.resourceName}/:id`, isAuthenticated, this.getById.bind(this));
    app.post(`/api/${this.resourceName}`, isAuthenticated, this.create.bind(this));
    app.put(`/api/${this.resourceName}/:id`, isAuthenticated, this.updateById.bind(this));
    app.delete(`/api/${this.resourceName}/:id`, isAuthenticated, this.deleteById.bind(this));
  }

  getAll(req: Request, res: Response, next: NextFunction) {
    res.set('Content-Type', 'application/json');

    this.service.getAll(req.userContext!)
      .then((docs) => {
        return res.status(200).json(docs);
      });
  }

  getById(req: Request, res: Response, next: NextFunction) {
    let id = req.params.id;
    res.set('Content-Type', 'application/json');

    //this.service.getById(req.context.orgId, id)
    this.service.getById({user: new User(), orgId: '999'}, id)
      .then((doc) => {
        if (doc === null) return next();

        return res.status(200).send(doc);
      })
      // todo: remove the catch and change to async/await? since I'm throwing errors from the service now
      .catch(err => {
        if (err.constructor == TypeError) {
          return res.status(400).json({'errors': [err.message]});
        }

        //err.message = `ERROR: ${this.resourceName}Controller -> getById(${req.context.orgId}, ${id}) - ${err.message}`;
        err.message = `ERROR: ${this.resourceName}Controller -> getById(${'999'}, ${id}) - ${err.message}`;
        return next(err);
      });
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const entity = await this.service.create(req.userContext!, req.body);
    return res.status(201).json(entity);
  }

  async updateById(req: Request, res: Response, next: NextFunction) {
    const entity = await this.service.updateById(req.userContext!, req.params.id, req.body);
    return res.status(200).json(entity);
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    const deleteResult = await this.service.deleteById(req.userContext!, req.params.id)
    return res.status(200).json(deleteResult);
  }
}
