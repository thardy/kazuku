(function(module) {

    module.config(function ($stateProvider) {
        $stateProvider.state('root.about', {
            url: '/about',
            views: {
                "main@": {
                    controller: 'AboutController as model',
                    templateUrl: 'about/about.tpl.html'
                }
            },
            data:{ pageTitle: 'About' }
        });
    });

}(angular.module("kazuku.about", [
    'ui.router'
])));
