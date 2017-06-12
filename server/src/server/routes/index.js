const CustomDataController = require('../../customData/customDataController');
const CustomSchemasController = require('../../customSchemas/customSchemasController');
const TemplatesController = require('../../templates/templatesController');
const AuthController = require('../../users/auth.controller');
const UsersController = require('../../users/users.controller');

// todo: convert this to be more modular (one file in each folder that aggregates all the controllers inside it)
exports.map = function(app) {
    let customDataController = new CustomDataController(app);
    let customSchemasController = new CustomSchemasController(app);
    let templatesController = new TemplatesController(app);
    let authController = new AuthController(app);
    let usersController = new UsersController(app);
};

// const express = require('express');
// const userRoutes = require('../users/users.routes');
// const authRoutes = require('../users/auth.routes');
//
// const router = express.Router(); // eslint-disable-line new-cap
//
// /** GET /health-check - Check service health */
// router.get('/health-check', (req, res) =>
//     res.send('OK')
// );
//
// // mount user routes at /users
// router.use('/users', userRoutes);
//
// // mount auth routes at /auth
// router.use('/auth', authRoutes);
//
// module.exports = router;