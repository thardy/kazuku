import { Express } from 'express';
import {Db} from 'mongodb';

import {AuthController} from '#features/auth/auth.controller';
import {UsersController} from '#features/users/users.controller';
import {SitesController} from '#features/sites/sites.controller';
import {OrganizationsController} from '#features/organizations/organizations.controller';
import {SetupController} from '#features/setup/setup.controller';

export default function(app: Express, db: Db) {
  // each controller has a 'mapRoutes' function that adds its routes to the express app
  const authController = new AuthController(app, db);
  // const customDataController = new CustomDataController(app, db);
  // const customSchemasController = new CustomSchemasController(app, db);
  const organizationsController = new OrganizationsController(app, db);
  // const queriesController = new QueriesController(app, db);
  // const schedulesController = new SchedulesController(app, db);
  const setupController = new SetupController(app, db);
  const sitesController = new SitesController(app, db);
  // const templatesController = new TemplatesController(app, db);
  const usersController = new UsersController(app, db);
};
