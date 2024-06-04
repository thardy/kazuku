import {ApiController} from '@common/controllers/api.controller';
import {User} from '../../common/models/user.model';
import {Express} from 'express';
import database from '../../server/database/database';
import {UserService} from './user.service';

export class UsersController extends ApiController<User> {
  userService: UserService;

  constructor(app: Express) {
    const userService = new UserService(database.db!);
    super('users', app, userService);

    this.userService = userService;
  }

  mapRoutes(app: Express) {
    super.mapRoutes(app); // map the base ApiController routes
  }
}
