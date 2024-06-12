import {IOrganization, IUser} from '@kazuku-cms/common';
import {ITokenResponse} from './token-response.model';

export interface ILoginResponse {
  tokens?: ITokenResponse;
  userContext?: {
    user: IUser;
    org: IOrganization;
  };
}

export class LoginResponse implements ILoginResponse {
  tokens?: ITokenResponse;
  userContext?: { // note that this userContext has a fully populated org property
    user: IUser;
    org: IOrganization;
  };

  constructor(options: ILoginResponse = {}) {
    this.tokens = options.tokens ?? undefined;
    this.userContext = options.userContext ?? undefined;
  }
}
