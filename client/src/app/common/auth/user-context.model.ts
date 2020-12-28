import {User} from './user.model';
import {Organization} from './organization.model';

export class UserContext {
    user: User;
    org: Organization;
    //preferences: UserPreferences;

    constructor(options: {
        user?: User,
        org?: Organization,
        //preferences?: UserPreferences,
    } = {}) {
        this.user = options.user || new User();
        this.org = options.org || new Organization();
        //this.preferences = options && options.preferences ? new UserPreferences(options.preferences) : new UserPreferences();
    }

}

