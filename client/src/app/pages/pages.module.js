(function(module) {

    module.config(function ($stateProvider) {
        $stateProvider.state('pages', {
            url: '/pages',
            views: {
                "main": {
                    controller: 'PagesController as model',
                    templateUrl: 'pages/pages.tpl.html'
                }
            },
            data:{ pageTitle: 'Pages' }
        });
    });

}(angular.module("kazuku.pages", [
    'ui.router'
])));
