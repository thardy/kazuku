export interface ITokenResponse {
  accessToken?: string;
  refreshToken?: string;
  expiresOn?: number; // timestamp (in milliseconds since Jan 1, 1970 UTC)
}

export class TokenResponse implements ITokenResponse {
  accessToken?: string;
  refreshToken?: string;
  expiresOn?: number; // timestamp (in milliseconds since Jan 1, 1970 UTC)

  constructor(options: ITokenResponse = {}) {
    this.accessToken = options.accessToken ?? undefined;
    this.refreshToken = options.refreshToken ?? undefined;
    this.expiresOn = options.expiresOn ?? undefined;
  }
}
