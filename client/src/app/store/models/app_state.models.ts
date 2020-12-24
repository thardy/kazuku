import {User} from '../../common/auth/user.model';
import {Organization} from '../../common/auth/organization.model';

export interface UserState {
    loading: boolean;
    loaded: boolean;
    errors: any;
    user: User;
    organization: Organization;
}

export const INITIAL_STATE: UserState = {
    loading: false,
    loaded: false,
    errors: null,
    user: new User(),
    organization: new Organization()
}
