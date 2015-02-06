(function(module) {

    module.controller('EditSiteController', function ($state, $window, Site) {
        var model = this;
        model.site = {};
        model.loading = false;
        model.update = update;

        init();

        function init() {
            model.site = getSite();
        }

        function getSite() {
            model.loading = true;
            Site.get({ siteId: $state.params.siteId }).$promise
                .then(function(response) {
                    model.site = response;
                    model.loading = false;
                });
        }

        function update() {
            model.site.$update()
                .then(function(response) {
                    $window.location = '#/sites';
                });
        }
    });

}(angular.module("kazuku.sites")));

