(function(module) {

    module.controller('AddSiteController', function ($window, Site) {
        var model = this;
        model.site = new Site();
        model.saveSite = saveSite;

        init();

        function init() {

        }

        function saveSite() {
            model.site.$save()
                .then(function (data) {
                    $window.location = '#/sites';
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally();
        }
    });

}(angular.module("kazuku.sites")));
