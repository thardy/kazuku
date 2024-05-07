import {Express, Request, Response, NextFunction} from 'express';
import {body, validationResult} from 'express-validator';
import { CrudController } from '../../common/controllers/crud.controller';
import { AuthService } from './auth.service';
import { RequestValidationError } from '../../common/errors/request-validation-error';
import { DatabaseConnectionError } from '../../common/errors/database-connection-error';
import {BadRequestError} from '../../common/errors/bad-request-error';
import {User} from '../../common/models/user.model';
import database from '../../database/database';

export class AuthController extends CrudController<User> {
  authService: AuthService;

  constructor(app: Express) {
    const authService = new AuthService(database.db!);
    super('auth', app, authService);

    this.authService = authService;
  }

  mapRoutes(app: Express) {
    super.mapRoutes(app); // map the base CrudController routes

    // app.post(
    //   //`/api/${this.resourceName}/login`,
    //   `/api/auth/login`,
    //   [
    //     body('email')
    //       .isEmail()
    //       .withMessage('email must be valid'),
    //     body('password')
    //       .trim()
    //       .isLength({min: 4, max: 20})
    //       .withMessage('password must be between 4 and 20 characters')
    //   ],
    //   async (req: Request, res: Response, next: NextFunction) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //       throw new RequestValidationError(errors.array());
    //     }
    //     const {email, password} = req.body;
    //
    //     next();
    //   },
    //   async (req: Request, res: Response) => {
    //     this.afterAuth(req, res);
    //   }
    // );

    app.post(`/api/${this.resourceName}/register`, this.registerUser.bind(this));
  }

  registerUser(req: Request, res: Response, next: NextFunction) {
    console.log('in registerUser');
    const orgId = '999'; // todo: pull from req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const {email, password} = req.body;

    //this.service.createUser(req.context.orgId, body)
    this.authService.createUser(orgId, req.body)
      .then((doc) => {
        return res.status(201).json(doc);
      })
      .catch(err => {
        if (err.constructor == TypeError) {
          return res.status(400).json({'errors': [err.message]});
        }

        if (err.code === 11000) {
          return res.status(409).json({'errors': ['Duplicate Key Error']});
        }

        err.message = `ERROR: {this.resourceName}Controller -> createUser({orgId}, {body}) - {err.message}`;
        return next(err);
      });
  }

  afterAuth(req: Request, res: Response) {
    console.log('doin some afterAuth');
    // const context = req.user;
    // // don't return password
    // //this.service.cleanUser(context.user);
    // res.status(200).json({
    //     user: context.user
    // });
  }
}
