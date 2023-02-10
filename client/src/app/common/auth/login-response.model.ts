import {UserContext} from './user-context.model';
import {Tokens} from './tokens.model';

export class LoginResponse {
    tokens: Tokens;
    userContext: UserContext;

    constructor(options: {
        tokens?: any,
        userContext?: any
    } = {}) {
        this.tokens = options.tokens ? new Tokens(options.tokens) : null;
        this.userContext = options.userContext ? new UserContext(options.userContext) : null;
    }
}
