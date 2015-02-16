(function(module) {

    module.controller('NavigationController', function () {
        var model = this;
        model.navItems = [];

        init();

        function init() {
            model.navItems = getNavItems();
        }

        function getNavItems() {
            return [
                {
                    name: 'Home',
                    description: 'Home',
                    stateName: 'root.home',
                    url: '#/home'
                },
                {
                    name: 'Sites',
                    description: 'Site management',
                    stateName: 'root.sites',
                    url: '#/sites'
                },
                {
                    name: 'Pages',
                    description: 'Page management',
                    stateName: 'root.pages',
                    url: '#/pages'
                },
                {
                    name: 'Account',
                    description: 'Account management',
                    stateName: 'root.account',
                    url: '#/account'
                }
            ];
        }
    });

}(angular.module("kazuku.layout")));
