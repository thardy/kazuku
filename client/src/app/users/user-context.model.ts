import {User} from './user.model';
import {Organization} from '../organizations/organization.model';

export class UserContext {
    user: User;
    org: Organization;

    constructor(options: {
        user?: User,
        org?: Organization
    } = {}) {
        this.user = options.user || new User();
        this.org = options.org || new Organization();
    }

}

