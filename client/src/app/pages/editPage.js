(function(module) {

    module.controller('EditPageController', function ($state, $window, Page) {
        var model = this;
        model.page = {};
        model.loading = false;
        model.update = update;

        init();

        function init() {
            model.page = getPage();
        }

        function getPage() {
            model.loading = true;
            Page.get({ pageId: $state.params.pageId }).$promise
                .then(function(response) {
                    model.page = response;
                    model.loading = false;
                });
        }

        function update() {
            model.page.$update()
                .then(function(response) {
                    $window.location = '#/pages';
                });
        }
    });

}(angular.module("kazuku.pages")));
