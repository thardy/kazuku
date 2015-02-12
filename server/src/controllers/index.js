(function (controllers) {

    var accountsController = require('./accountsController');
    var authController = require('./authController');
    var pagesController = require('./pagesController');

    controllers.init = function (app) {
        accountsController.init(app);
        authController.init(app);
        pagesController.init(app);
    };

})(module.exports);
