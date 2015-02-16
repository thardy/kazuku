(function(module) {

    module.controller('PagesController', function (Page) {
        var model = this;
        model.loading = false;
        model.pages = [];

        init();

        function init() {
            model.pages = getPages();
        }

        function getPages() {
            model.loading = true;
            Page.query().$promise.then(function(response) {
                model.pages = response;
                model.loading = false;
            });
        }
    });

}(angular.module("kazuku.pages")));