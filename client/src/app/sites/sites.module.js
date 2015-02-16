(function(module) {

    module.config(function ($stateProvider) {
        $stateProvider
            .state('root.sites', {
                url: '/sites',
                views: {
                    'main@': {
                        controller: 'SitesController as model',
                        templateUrl: 'sites/sites.tpl.html'
                    }
                },
                data:{ pageTitle: 'Sites' }
            })
            .state('root.addSite', {
                url: '/sites/add-site',
                views: {
                    'main@': {
                        controller: 'AddSiteController as model',
                        templateUrl: 'sites/addSite.tpl.html'
                    }
                },
                data:{ pageTitle: 'Add Site' }
            })
            .state('root.editSite', {
                url: '/sites/edit-site/{siteId}',
                views: {
                    'main@': {
                        controller: 'EditSiteController as model',
                        templateUrl: 'sites/editSite.tpl.html'
                    }
                },
                data:{ pageTitle: 'Edit Site' }
            });
    });

}(angular.module('kazuku.sites', [
    'ui.router',
    'ngResource'
])));
