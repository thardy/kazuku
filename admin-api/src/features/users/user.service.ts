import {User} from '@kazuku-cms/common';
import {Db} from 'mongodb';

import {GenericApiService} from '#common/services/generic-api.service';

// todo: determine if I need this UserService. Does AuthService take care of everything?
export class UserService extends GenericApiService<User> {
  constructor(db: Db) {
    super(db, 'users', 'user');
  }
}
