import {IUserContext} from '@kazuku-cms/common';

declare global{
  namespace Express {
    interface Request {
      userContext?: IUserContext,
    }
  }
}
