(function(module) {
    module.directive('pageForm', function() {
        var linker = function(scope, element, attrs) {
            // do DOM Manipulation here
        };
        return {
            restrict: 'A',
            templateUrl: 'pages/directives/pageForm.tpl.html',
            link: linker,
            controller: 'PageFormController as model',
            bindToController: true,
            scope: {
                page: '=pageForm',
                lookups: '=pageLookups'
            }
        };
    });

    module.controller('PageFormController', function() {
        var model = this;

    });
})(angular.module('kazuku.pages'));