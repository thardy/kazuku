(function(module) {

    module.config(function ($stateProvider) {
        $stateProvider
            .state('root.pages', {
                url: '/pages',
                views: {
                    'main@': {
                        controller: 'PagesController as model',
                        templateUrl: 'pages/pages.tpl.html'
                    }
                },
                data:{ pageTitle: 'Pages' }
            })
            .state('root.addPage', {
                url: '/pages/add-page',
                views: {
                    'main@': {
                        controller: 'AddPageController as model',
                        templateUrl: 'pages/addPage.tpl.html'
                    }
                },
                data:{ pageTitle: 'Add Page' }
            })
            .state('root.editPage', {
                url: '/pages/edit-page/{pageId}',
                views: {
                    'main@': {
                        controller: 'EditPageController as model',
                        templateUrl: 'pages/editPage.tpl.html'
                    }
                },
                data:{ pageTitle: 'Edit Page' }
            });
    });

}(angular.module('kazuku.pages', [
    'ui.router',
    'ngResource'
])));
