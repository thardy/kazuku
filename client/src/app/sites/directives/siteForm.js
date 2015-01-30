(function(module) {
    module.directive('siteForm', function() {
        var linker = function(scope, element, attrs) {
            // do DOM Manipulation here
        };
        var controller = function() {

        };

        return {
            restrict: 'A',
            templateUrl: 'sites/directives/siteForm.tpl.html',
            link: linker,
            controller: controller,
            scope: {
                site: '='
            }
        };

    });
})(angular.module('kazuku.sites'));
