import {GenericApiService} from '../../common/services/generic-api.service';
import {User} from '../../common/models/user.model';
import {Db} from 'mongodb';

export class UserService extends GenericApiService<User> {
  constructor(db: Db) {
    super(db, 'users');
  }
}
