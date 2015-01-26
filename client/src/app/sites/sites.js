(function(module) {

    module.controller('SitesController', function () {
        var model = this;
        model.sites = [];

        init();

        function init() {
            model.sites = getSites();
        }

        function getSites() {
            return [
                {
                    name: 'Bob\'s Chicken',
                    description: 'A restaurant'
                },
                {
                    name: 'Jack & Jane',
                    description: 'Knick knack boutique'
                },
                {
                    name: 'El Dorado Apartments',
                    description: 'Apartment complex'
                },
            ];
        }
    });

}(angular.module("kazuku.sites")));