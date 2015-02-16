(function(module) {

    module.controller('AddSiteController', function ($window, Site) {
        var model = this;
        model.site = new Site();
        model.save = save;

        init();

        function init() {

        }

        function save() {
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
