import {Express, NextFunction, Request, Response} from 'express';
import {GenericApiService} from '../services/generic-api.service';
import {IGenericApiService} from '../services/generic-api-service.interface';
import {User} from '../models/user.model';
//import authHelper from '../common/auth-helper.ts';
//import current from '../common/current.ts';

export abstract class CrudController<T> {
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
    // app.get(`/api/${this.resourceName}`, authHelper.isAuthenticated, this.getAll.bind(this));
    // app.get(`/api/${this.resourceName}/:id`, authHelper.isAuthenticated, this.getById.bind(this));
    // app.post(`/api/${this.resourceName}`, authHelper.isAuthenticated, this.create.bind(this));
    // app.put(`/api/${this.resourceName}/:id`, authHelper.isAuthenticated, this.updateById.bind(this));
    // app.delete(`/api/${this.resourceName}/:id`, authHelper.isAuthenticated, this.deleteById.bind(this));
    app.get(`/api/${this.resourceName}`, this.getAll.bind(this));
    // app.get(`/api/${this.resourceName}/:id`, this.getById.bind(this));
    // app.post(`/api/${this.resourceName}`, this.create.bind(this));
    // app.put(`/api/${this.resourceName}/:id`, this.updateById.bind(this));
    // app.delete(`/api/${this.resourceName}/:id`, this.deleteById.bind(this));
  }

  getAll(req: Request, res: Response, next: NextFunction) {
    res.set('Content-Type', 'application/json');

    // todo: replace with req.context
    this.service.getAll({user: new User(), orgId: '999'})
      .then((docs) => {
        return res.status(200).json(docs);
      })
      .catch(err => {
        //err.message = `ERROR: ${this.resourceName}Controller -> getAll(${req.context.orgId}) - ${err.message}`;
        err.message = `ERROR: ${this.resourceName}Controller -> getAll(${'999'}) - ${err.message}`;
        return next(err);
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
      .catch(err => {
        if (err.constructor == TypeError) {
          return res.status(400).json({'errors': [err.message]});
        }

        //err.message = `ERROR: ${this.resourceName}Controller -> getById(${req.context.orgId}, ${id}) - ${err.message}`;
        err.message = `ERROR: ${this.resourceName}Controller -> getById(${'999'}, ${id}) - ${err.message}`;
        return next(err);
      });
  }

  // create(req: Request, res: Response, next: NextFunction) {
  //   let body = req.body;
  //
  //   this.service.create(req.context.orgId, body)
  //     .then((doc) => {
  //       return res.status(201).json(doc);
  //     })
  //     .catch(err => {
  //       if (err.constructor == TypeError) {
  //         return res.status(400).json({'errors': [err.message]});
  //       }
  //
  //       if (err.code === 11000) {
  //         return res.status(409).json({'errors': ['Duplicate Key Error']});
  //       }
  //
  //       err.message = `ERROR: ${this.resourceName}Controller -> create(${req.context.orgId}, ${body}) - ${err.message}`;
  //       return next(err);
  //     });
  // }
  //
  // updateById(req: Request, res: Response, next: NextFunction) {
  //   let id = req.params.id;
  //   let body = req.body;
  //
  //   this.service.updateById(req.context.orgId, id, body)
  //     .then((doc) => {
  //       return res.status(200).json(doc);
  //     })
  //     .catch(err => {
  //       if (err.constructor == TypeError) {
  //         return res.status(400).json({'errors': [err.message]});
  //       }
  //
  //       err.message = `ERROR: ${this.resourceName}Controller -> updateById(${req.context.orgId}, ${id}, ${body}}) - ${err.message}`;
  //       return next(err);
  //     });
  // }

  // deleteById(req: Request, res: Response, next: NextFunction) {
  //   let id = req.params.id;
  //   //this.service.delete(req.context.orgId, id)
  //   this.service.delete('999', id)
  //     .then((commandResult) => {
  //       if (commandResult.result.n <= 0) {
  //         return res.status(204).json({'errors': ['id not found']});
  //       }
  //
  //       return res.status(204).json({});
  //     })
  //     .catch(err => {
  //       if (err.constructor == TypeError) {
  //         return res.status(400).json({'errors': [err.message]});
  //       }
  //
  //       //err.message = `ERROR: ${this.resourceName}Controller -> delete(${req.context.orgId}, ${id}) - ${err.message}`;
  //       err.message = `ERROR: ${this.resourceName}Controller -> delete(${'999'}, ${id}) - ${err.message}`;
  //       return next(err);
  //     });
  // }
}
