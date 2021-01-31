import CustomDataController from '../../customData/customDataController.js';
import CustomSchemasController from '../../customSchemas/customSchemasController.js';
import TemplatesController from '../../templates/templatesController.js';
import AuthController from '../../auth/authController.js';
import OrganizationsController from '../../organizations/organizationsController.js';
import SetupController from '../../setup/setupController.js';
import SitesController from '../../sites/sitesController.js';
import QueriesController from '../../queries/queriesController.js';
import SchedulesController from '../../schedules/schedulesController.js';

// todo: convert this to be more modular (one file in each folder that aggregates all the controllers inside it)
// Currently, routing requires any new controller to be present here in order for its routes to get mapped.
//exports.map = function(app) { // todo: test that changing this didn't break all routes
export default function(app) {
    let customDataController = new CustomDataController(app);
    let customSchemasController = new CustomSchemasController(app);
    let templatesController = new TemplatesController(app);
    let authController = new AuthController(app);
    let organizationsController = new OrganizationsController(app);
    let setupController = new SetupController(app);
    let sitesController = new SitesController(app);
    let queriesController = new QueriesController(app);
    let schedulesController = new SchedulesController(app);
};
