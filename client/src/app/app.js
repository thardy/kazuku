(function(app) {

    app.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    });

    app.run(function () {});

    app.controller('AppController', function ($scope) {

    });

}(angular.module("kazuku", [
    'kazuku.layout',
    'kazuku.home',
    'kazuku.sites',
    'kazuku.pages',
    'kazuku.about',
    'templates-app',
    'templates-common',
    'ui.router.state',
    'ui.router',
])));
