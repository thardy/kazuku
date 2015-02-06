(function(module) {

    module.controller('AddPageController', function ($window, Page) {
        var model = this;
        model.page = new Page();
        model.save = save;

        init();

        function init() {

        }

        function save() {
            model.page.$save()
                .then(function (data) {
                    $window.location = '#/pages';
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally();
        }
    });

}(angular.module("kazuku.pages")));
