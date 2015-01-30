(function(module) {

    module.controller('EditSiteController', function () {
        var model = this;
        model.site = {};

        init();

        function init() {
            model.site = getSite();
        }

        function getSite() {
            return {
                name: 'Site1',
                description: 'This is Site1'
            };
        }
    });

}(angular.module("kazuku.sites")));

