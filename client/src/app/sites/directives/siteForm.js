(function(module) {
    module.directive('siteForm', function() {
        var linker = function(scope, element, attrs) {
            // do DOM Manipulation here
        };
        return {
            restrict: 'A',
            templateUrl: 'sites/directives/siteForm.tpl.html',
            link: linker,
            controller: 'SiteFormController as model',
            bindToController: true,
            scope: {
                site: '=siteForm',
                lookups: '=siteLookups'
            }
        };
    });

    module.controller('SiteFormController', function() {
        var model = this;

    });
})(angular.module('kazuku.sites'));

