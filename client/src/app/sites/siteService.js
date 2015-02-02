(function(module) {
    module.factory('Site', ['$resource', function($resource) {
        var Site = $resource(
            '/api/sites/:siteId',
            { siteId: '@id' },
            { 'update': {method: 'PUT'} }
        );

        // Example of how to attach a method to each object returned in the response
//        angular.extend(Site.prototype, {
//            getResult: function() {
//                if (this.status == 'complete') {
//                    if (this.passed === null) return "Finished";
//                    else if (this.passed === true) return "Pass";
//                    else if (this.passed === false) return "Fail";
//                }
//                else return "Running";
//            }
//        });

        return Site;
    }]);
})(angular.module('kazuku.sites'));