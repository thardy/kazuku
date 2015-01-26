(function(module) {

    module.controller('NavigationController', function () {
        var model = this;
        model.pages = [];

        init();

        function init() {
            model.pages = getNavItems();
        }

        function getNavItems() {
            return [
                {
                    name: 'Google',
                    description: 'This is Google',
                    url: 'http://google.com'
                },
                {
                    name: 'Amazon',
                    description: 'This is Amazon',
                    url: 'http://amazon.com'
                },
                {
                    name: 'Twitter',
                    description: 'Twitter is nice',
                    url: 'http://twitter.com'
                },
            ];
        }
    });

}(angular.module("kazuku.layout")));
