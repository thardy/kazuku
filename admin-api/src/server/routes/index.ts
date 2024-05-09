import { Express } from 'express';
import { AuthController } from '../../features/auth/auth.controller';
import {UsersController} from '../../features/users/users.controller';

export default function(app: Express) {
  // each controller has a 'mapRoutes' function that adds its routes to the express app
  let authController = new AuthController(app);
  // let customDataController = new CustomDataController(app);
  // let customSchemasController = new CustomSchemasController(app);
  // let organizationsController = new OrganizationsController(app);
  // let queriesController = new QueriesController(app);
  // let schedulesController = new SchedulesController(app);
  // let setupController = new SetupController(app);
  // let sitesController = new SitesController(app);
  // let templatesController = new TemplatesController(app);
  let usersController = new UsersController(app);
};
