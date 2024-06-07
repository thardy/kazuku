import {ApiController} from '#common/controllers/api.controller';
import {User} from '../../common/models/user.model';
import {Express} from 'express';
import {UserService} from './user.service';
import {Db} from 'mongodb';

export class UsersController extends ApiController<User> {
  userService: UserService;

  constructor(app: Express, db: Db) {
    const userService = new UserService(db);
    super('users', app, userService);

    this.userService = userService;
  }

  mapRoutes(app: Express) {
    super.mapRoutes(app); // map the base ApiController routes
  }
}
