export class Tokens {
    accessToken: string;
    refreshToken: string;
    expiresOn: number;

    constructor(options: {
        accessToken?: string,
        refreshToken?: string,
        expiresOn?: number
    } = {}) {
        this.accessToken = options.accessToken;
        this.refreshToken = options.refreshToken;
        this.expiresOn = options.expiresOn;
    }
}
