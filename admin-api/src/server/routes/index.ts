import { Express } from 'express';
import { AuthController } from '@features/auth/auth.controller';
import {UsersController} from '@features/users/users.controller';
import {SitesController} from '@features/sites/sites.controller';
import {OrganizationsController} from '@features/organizations/organizations.controller';
import {SetupController} from '@features/setup/setup.controller';

export default function(app: Express) {
  // each controller has a 'mapRoutes' function that adds its routes to the express app
  const authController = new AuthController(app);
  // const customDataController = new CustomDataController(app);
  // const customSchemasController = new CustomSchemasController(app);
  const organizationsController = new OrganizationsController(app);
  // const queriesController = new QueriesController(app);
  // const schedulesController = new SchedulesController(app);
  const setupController = new SetupController(app);
  const sitesController = new SitesController(app);
  // const templatesController = new TemplatesController(app);
  const usersController = new UsersController(app);
};
