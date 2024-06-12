import {IUserContext} from '../../../../common/src/models/user-context.interface';

declare global{
  namespace Express {
    interface Request {
      userContext?: IUserContext,
    }
  }
}
