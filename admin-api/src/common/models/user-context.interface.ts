import {User} from './user.model';

export interface IUserContext {
  user: User;
  orgId: string; // this is the selectedOrgId - user's org for most, but possibly a different org for a metaAdmin
  // we may need to add org at some point for convenient org info - this would be the org of the user
}
