// an experiment, on using functional methods to compose a controller instead of classes - giving up on this for now. Classes and OO just
//  make more sense for this, at least to me.
// import {Express, Request, Response, NextFunction} from 'express';
// import IGenericService from '../services/generic-service.interface';
//
// function addBasicCrudRoutes<T>(resourceName: string, app: Express, service: IGenericService) {
//   app.get(`/api/${this.resourceName}`, getAll);
//   app.get(`/api/${this.resourceName}/:id`, getById);
//   app.post(`/api/${this.resourceName}`, create);
//   app.put(`/api/${this.resourceName}/:id`, updateById);
//   app.delete(`/api/${this.resourceName}/:id`, deleteById);
// }
//
// function getAll(req: Request, res: Response, next: NextFunction): Promise<T[]> {
//     res.set("Content-Type", "application/json");
//
//     this.service.getAll(req.context.orgId)
//         .then((docs) => {
//             return res.status(200).json(docs);
//         })
//         .catch(err => {
//             err.message = `ERROR: ${this.resourceName}Controller -> getAll(${req.context.orgId}) - ${err.message}`;
//             return next(err);
//         });
//
// }
//
// export { addBasicCrudRoutes };
