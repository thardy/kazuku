import {Express, Request, Response, NextFunction} from 'express';
import {body, validationResult} from 'express-validator';
import { CrudController } from '../../common/controllers/crud.controller';
import { AuthService } from './auth.service';
import { RequestValidationError } from '../../common/errors/request-validation-error';
import { DatabaseConnectionError } from '../../common/errors/database-connection-error';

export class AuthController extends CrudController<any> {
  constructor(app: Express) {
    super('auth', app, new AuthService(null));
  }

  mapRoutes(app: Express) {
    //super.mapRoutes(app); // map the base CrudController routes

    app.post(
      //`/api/${this.resourceName}/login`,
      `/api/auth/login`,
      [
        body('email')
          .isEmail()
          .withMessage('email must be valid'),
        body('password')
          .trim()
          .isLength({min: 4, max: 20})
          .withMessage('password must be between 4 and 20 characters')
      ],
      async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new RequestValidationError(errors.array());
        }
        const {email, password} = req.body;
        console.log('logging in');
        //throw new DatabaseConnectionError();

        res.send({}); // todo: we will be removing this soon - only one handler can respond - we'll do it in afterAuth().
        next();
      },
      async (req: Request, res: Response) => {
        this.afterAuth(req, res);
      }
    );
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
