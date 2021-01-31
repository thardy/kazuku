export interface IAuthProvider {
    // redirectToAuthProviderLogin(): void;
    // requestTokenUsingAuthCode(authCode: string): Promise<any>;
    requestTokenUsingRefreshToken(refreshToken: string): Promise<any>;
}
