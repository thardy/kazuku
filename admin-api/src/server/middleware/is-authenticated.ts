import { Request, Response, NextFunction } from 'express';
import passport from "passport";
import {IUserContext} from '@common/models/user-context.interface';
import {UnauthenticatedError} from '@common/errors/unauthenticated.error';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  //req.userContext = { user: new User(), orgId: '999'};
  //next();
  passport.authenticate('jwt', { session: false }, (err: Error | null, userContext: IUserContext, info: any) => {
    if (err) { return next(err); }
    if (!userContext) {
      throw new UnauthenticatedError();
    }

    req.userContext = userContext;
    return next();
  })(req, res, next);
};

// this is how to handle this without passport
// export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//   // if (!req.userContext) {
//   //
//   // }
//   if (!req.jwt) {
//     return next();
//   }
//
//   try {
//     const payload = jwt.verify(req.jwt, config.clientSecret!) as IUserContext;
//     req.userContext = payload;
//   } catch (err) {}
//
//   next();
//
// }
