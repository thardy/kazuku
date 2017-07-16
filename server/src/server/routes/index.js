const CustomDataController = require('../../customData/customDataController');
const CustomSchemasController = require('../../customSchemas/customSchemasController');
const TemplatesController = require('../../templates/templatesController');
const UsersController = require('../../users/usersController');
const OrganizationsController = require('../../organizations/organizationsController');

// todo: convert this to be more modular (one file in each folder that aggregates all the controllers inside it)
exports.map = function(app) {
    let customDataController = new CustomDataController(app);
    let customSchemasController = new CustomSchemasController(app);
    let templatesController = new TemplatesController(app);
    let usersController = new UsersController(app);
    let organizationsController = new OrganizationsController(app);
};
