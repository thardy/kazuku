(function(module) {

    module.config(function ($stateProvider) {
        $stateProvider.state('sites', {
            url: '/sites',
            views: {
                "main": {
                    controller: 'SitesController as model',
                    templateUrl: 'sites/sites.tpl.html'
                }
            },
            data:{ pageTitle: 'Sites' }
        });
    });

}(angular.module("kazuku.sites", [
    'ui.router'
])));
