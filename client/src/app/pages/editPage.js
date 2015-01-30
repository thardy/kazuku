(function(module) {

    module.controller('EditPageController', function () {
        var model = this;
        model.page = {};

        init();

        function init() {
            model.page = getPage();
        }

        function getPage() {
            return {
                name: 'Page1',
                description: 'This is Page1'
            };
        }
    });

}(angular.module("kazuku.pages")));
