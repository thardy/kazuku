export class Tokens {
    accessToken: string;
    refreshToken: string;

    constructor(options: {
        accessToken?: string,
        refreshToken?: string
    } = {}) {
        this.accessToken = options.accessToken;
        this.refreshToken = options.refreshToken;
    }
}
