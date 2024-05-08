import {User} from './user.model';

export interface IUserContext {
  user: User;
  orgId: string;
}
