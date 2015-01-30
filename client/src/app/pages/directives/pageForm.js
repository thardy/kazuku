(function(module) {
    module.directive('pageForm', function() {
        var linker = function(scope, element, attrs) {
            // do DOM Manipulation here
        };
        var controller = function() {

        };

        return {
            restrict: 'A',
            templateUrl: 'pages/directives/pageForm.tpl.html',
            link: linker,
            controller: controller,
            scope: {
                page: '='
            }
        };

    });
})(angular.module('kazuku.pages'));
