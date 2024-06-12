import {Db} from 'mongodb';
import {Express} from 'express';
import {User} from '@kazuku-cms/common';

import {ApiController} from '#common/controllers/api.controller';
import {UserService} from './user.service';

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
