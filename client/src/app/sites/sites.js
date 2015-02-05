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
            Site.query().$promise.then(function(response) {
                model.sites = response;
                model.loadingSites = false;
            });
        }
    });

}(angular.module("kazuku.sites")));