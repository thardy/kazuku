import {User} from './user.model';
import {Organization} from './organization.model';

export interface IUserContext {
    user: User;
    org: Organization;
    isAuthenticated: boolean;
    //preferences: UserPreferences;
}

export class UserContext implements IUserContext {
    user: User;
    org: Organization;
    isAuthenticated: boolean;
    //preferences: UserPreferences;

    constructor(options: {
        user?: User,
        org?: Organization,
        isAuthenticated?: boolean,
        //preferences?: UserPreferences,
    } = {}) {
        this.user = options.user ?? new User();
        this.org = options.org ?? new Organization();
        this.isAuthenticated = options.isAuthenticated ?? false;
        //this.preferences = options && options.preferences ? new UserPreferences(options.preferences) : new UserPreferences();
    }

    serialize() {
        return {
            user: { ...this.user },
            org: { ...this.org },
            isAuthenticated: this.isAuthenticated
        };
    }

}

