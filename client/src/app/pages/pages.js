(function(module) {

    module.controller('PagesController', function () {
        var model = this;
        model.pages = [];

        init();

        function init() {
            model.pages = getPages();
        }

        function getPages() {
            return [
                {
                    name: 'Page1',
                    description: 'This is Page1'
                },
                {
                    name: 'Page2',
                    description: 'This is Page2'
                },
                {
                    name: 'Page3',
                    description: 'This is Page3'
                },
            ];
        }
    });

}(angular.module("kazuku.pages")));