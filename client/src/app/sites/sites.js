(function(module) {

    module.controller('SitesController', function (Site) {
        var model = this;
        model.loading = false;
        model.sites = [];

        init();

        function init() {
            model.sites = getSites();
        }

        function getSites() {
            model.loading = true;
            Site.query().$promise.then(function(response) {
                model.sites = response;
                model.loading = false;
            });
        }
    });

}(angular.module("kazuku.sites")));