const CustomDataController = require('../../customData/customDataController');
const CustomSchemasController = require('../../customSchemas/customSchemasController');
const TemplatesController = require('../../templates/templatesController');
const UsersController = require('../../users/usersController');
const OrganizationsController = require('../../organizations/organizationsController');
const SetupController = require('../../setup/setupController');
const SitesController = require('../../sites/sitesController');
const QueriesController = require('../../queries/queriesController');
const SchedulesController = require('../../schedules/schedulesController');

// todo: convert this to be more modular (one file in each folder that aggregates all the controllers inside it)
// Currently, routing requires any new controller to be present here in order for its routes to get mapped.
//exports.map = function(app) { // todo: test that changing this didn't break all routes
export default function(app) {
    let customDataController = new CustomDataController(app);
    let customSchemasController = new CustomSchemasController(app);
    let templatesController = new TemplatesController(app);
    let usersController = new UsersController(app);
    let organizationsController = new OrganizationsController(app);
    let setupController = new SetupController(app);
    let sitesController = new SitesController(app);
    let queriesController = new QueriesController(app);
    let schedulesController = new SchedulesController(app);
};
