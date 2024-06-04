import {User} from './user.model';

export interface IUserContext {
  // UserContext on the server is slightly different than on the client - we don't care about the
  //  whole org object, just the orgId. If that changes, it should be easy to refactor.
  user: User;
  orgId: string; // this is the selectedOrgId - user's org for most, but possibly a different org for a metaAdmin.
  // we may need to add org at some point for convenient org info - this would be the selected org
}
