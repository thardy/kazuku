(function(app) {

    app.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    });

    app.run(function () {});

    app.controller('AppController', function ($scope, $state) {
        var model = this;

        $scope.$on('$stateChangeSuccess', stateChangeSuccess);

        function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                model.pageTitle = toState.data.pageTitle;
            }
        }
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
