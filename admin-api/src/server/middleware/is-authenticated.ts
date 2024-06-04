import { Request, Response, NextFunction } from 'express';
import {IUserContext} from '@common/models/user-context.interface';
import {UnauthenticatedError} from '@common/errors/unauthenticated.error';
import jwt from 'jsonwebtoken';
import config from '@server/config';
import {IUser} from '@common/models/user.model';

// export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
//   //req.userContext = { user: new User(), orgId: '999'};
//   //next();
//   passport.authenticate('jwt', { session: false }, (err: Error | null, userContext: IUserContext, info: any) => {
//     if (err) { return next(err); }
//     if (!userContext) {
//       throw new UnauthenticatedError();
//     }
//
//     req.userContext = userContext;
//     return next();
//   })(req, res, next);
// };

// this is how to handle auth without passport
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  let token = null;
  console.log('in isAuthenticated');

  // check Authorization Header
  if (req.headers?.authorization) {
    let authHeader = req.headers.authorization;
    const authHeaderArray = authHeader.split('Bearer ');
    if (authHeaderArray?.length > 1) {
      token = authHeaderArray[1];
    }
  }

  if (token) {
    try {
      const payload = jwt.verify(token, config.clientSecret) as IUserContext;
      req.userContext = payload;
      next();
    }
    catch (err) {
      throw new UnauthenticatedError();
    }
  }
  else {
    throw new UnauthenticatedError();
  }
}
