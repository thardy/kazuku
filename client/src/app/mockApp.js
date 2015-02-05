(function(module) {
    module.run(function($httpBackend, $filter, $location) {

        // Intercept only the calls we want to mock

        // *** Sites *****************************************************************************************
        // I use objects because writing json in javascript is a pain and converting via $filter is easy
        var sites = [
            { id: 1, name: 'Acme Construction', description: 'Can we build it?' },
            { id: 2, name: 'Bands R Us', description: 'All about bands.' },
            { id: 3, name: 'Widgets Are Cool', description: 'We gonna sell you some widgets.' }
        ];

        var indentSpacing = 2;

        // Sites GET with id - these tend to be greedy so the more specific GET with parm HAS to be listed
        //  before the generic GET all or the GET all will suck up the GET with parm requests.
        $httpBackend.whenGET(/api\/sites\/[\d]+/).respond(function(method, url, data) {
            var path = $location.path(); // returns "/sites/edit-site/1", so the id will be index 3
            var pathArray = path.split('/');
            var siteId = pathArray[3];
            return [200, $filter('json')(getById(sites, siteId), indentSpacing), { 'Cache-control': 'no-cache' }];
        });
        // Sites GET all
        $httpBackend.whenGET(/api\/sites/).respond(function(method, url, data) {
            return [200, $filter('json')(sites, indentSpacing), { 'Cache-control': 'no-cache' }];
        });
        // Sites POST
        $httpBackend.whenPOST(/api\/sites/).respond(function(method, url, data) {
            // Add to our sites array, which is acting like a fake database
            var newSite = angular.fromJson(data);
            newSite.id = sites.push(newSite); // data should be the json site that was posted to us,
                                              //  and the new length of sites should make a fine fake Id
            return [200, newSite, {}]; // respond expects us to return array containing status, data, headers
        });
        // ***************************************************************************************************

        // Now let everything else, everything not specified above, pass through to their real http calls
        $httpBackend.whenGET(/.+/).passThrough();
        $httpBackend.whenPOST(/.+/).passThrough();
        $httpBackend.whenPUT(/.+/).passThrough();

        function getById(array, id) {
            var len = array.length;
            for (i = 0; i < len; i++) {
                if (+array[i].id == +id) {
                    return array[i];
                }
            }
            return null;
        }
    });
})(angular.module('mockApp', ['kazuku', 'ngMockE2E']));

