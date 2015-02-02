(function(module) {
    module.run(function($httpBackend, $filter) {

        // Intercept only the calls we want to mock

        // *** Sites *****************************************************************************************
        // I use objects because writing json in javascript is a pain and converting via $filter is easy
        var sites = [
            { name: 'Acme Construction', description: 'Can we build it?' },
            { name: 'Bands R Us', description: 'All about bands.' },
            { name: 'Widgets Are Cool', description: 'We gonna sell you some widgets.' }
        ];

        var indentSpacing = 2;
        // Sites GET
        $httpBackend.whenGET(/api\/sites/).respond($filter('json')(sites, indentSpacing));
        // Sites POST
        $httpBackend.whenPOST('/api\/sites/').respond(function(method, url, data) {
            // Add to our sites array, which is acting like a fake database
            var newSite = angular.fromJson(data);
            newSite.Id = sites.push(newSite); // data should be the json site that was posted to us,
                                              //  and the new length of sites should make a fine fake Id
            return [200, newSite, {}]; // respond expects us to return array containing status, data, headers
        });
        // ***************************************************************************************************

        // Now let everything else, everything not specified above, pass through to their real http calls
        $httpBackend.whenGET(/.+/).passThrough();
        $httpBackend.whenPOST(/.+/).passThrough();
        $httpBackend.whenPUT(/.+/).passThrough();
    });
})(angular.module('kazuku.mock', ['kazuku', 'ngMockE2E']));

