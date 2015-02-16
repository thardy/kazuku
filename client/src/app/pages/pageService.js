(function(module) {
    module.factory('Page', function($resource) {
        return $resource(
            '/api/pages/:pageId',
            { pageId: '@id' },
            { 'update': {method: 'PUT'} }
        );
    });
})(angular.module('kazuku.pages'));
