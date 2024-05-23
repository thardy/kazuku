import {IUserContext} from '@common/models/user-context.interface';

declare global{
  namespace Express {
    interface Request {
      userContext?: IUserContext,
      jwt?: string
    }
  }
}
