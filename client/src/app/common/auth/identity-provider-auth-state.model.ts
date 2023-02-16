export class IdentityProviderAuthState {
    isAuthenticated: boolean;
    accessToken: string;

    constructor(options: {
        isAuthenticated?: boolean,
        accessToken?: string,
    } = {}) {
        this.isAuthenticated = options.isAuthenticated ?? false;
        this.accessToken = options.accessToken ?? null;
    }
}
