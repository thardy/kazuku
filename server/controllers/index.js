(function (controllers) {

    var accountsController = require("./accountsController");

    controllers.init = function (app) {
        accountsController.init(app);
    };

})(module.exports);
