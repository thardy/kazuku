(function(module) {

    module.controller('SitesController', function (Site) {
        var model = this;
        model.loadingSites = false;
        model.sites = [];

        init();

        function init() {
            model.sites = getSites();
        }

        function getSites() {
            model.loadingSites = true;
            Site.query().$promise.then(function(sites) {
                model.sites = sites;
                model.loadingSites = false;
            });
        }
    });

}(angular.module("kazuku.sites")));