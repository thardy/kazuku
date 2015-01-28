(function(module) {

    module.config(function ($stateProvider) {
        $stateProvider.state('root', {
            url: '',
            abstract: true,
            views: {
//                'header': {
//                    controller: 'HeaderController as model',
//                    templateUrl: 'layout/header.tpl.html'
//                },
                'navigation': {
                    controller: 'NavigationController as model',
                    templateUrl: 'layout/navigation.tpl.html',
                    transclude: true
                }
            }
        });
    });

// The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("kazuku.layout", [
    'ui.router'
])));
