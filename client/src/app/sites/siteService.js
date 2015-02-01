(function(module) {
    module.factory('Site', function($resource) {
        return $resource(
            '/api/sites/:siteId',
            { siteId: '@id' },
            { 'update': {method: 'PUT'} }
        );
    });
})(angular.module('kazuku.sites'));
