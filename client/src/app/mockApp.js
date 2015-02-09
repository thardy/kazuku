(function(module) {
    module.run(function($httpBackend, $filter, $location) {
        var indentSpacing = 2;

        // Intercept only the calls we want to mock

        // *** Sites *****************************************************************************************
        // I use objects because writing json in javascript is a pain and converting via $filter is easy
        var sites = [
            { id: 1, name: 'Acme Construction', description: 'Can we build it?' },
            { id: 2, name: 'Bands R Us', description: 'All about bands.' },
            { id: 3, name: 'Widgets Are Cool', description: 'We gonna sell you some widgets.' },
            { id: 4, name: 'Mega Apartments', description: 'Live here because we said so.' }
        ];

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
        // Sites PUT
        $httpBackend.whenPUT(/api\/sites\/[\d]+/).respond(function(method, url, data) {
            // Add to our sites array, which is acting like a fake database
            var updatedSite = angular.fromJson(data);
            var index = sites.indexOf(getById(sites, updatedSite.id));
            sites[index] = updatedSite;
            return [201, updatedSite, {}]; // respond expects us to return array containing status, data, headers
        });
        // ***************************************************************************************************

        // *** Pages *****************************************************************************************
        // todo: test actual templating engine, especially with includes (how do they work?) - if content contains another
        //  template, how does it find that template?
        var pages = [
            { id: 1, siteId: 4, name: 'Home', description: 'Welcome to our wonderful site!', stateName: 'root.home', url: '#/home', content: '#Home Page' },
            { id: 2, siteId: 4, name: 'Floor Plans', description: 'Floor Plans.', stateName: 'root.floorPlans', url: '#/floorplans', content: '#Floor Plans' },
            { id: 3, siteId: 4, name: 'Amenities', description: 'Amenities.', stateName: 'root.amenities', url: '#/amenities', content: '#Amenities' },
            { id: 3, siteId: 4, name: 'Gallery', description: 'Gallery.', stateName: 'root.gallery', url: '#/gallery', content: '#Gallery' },
            { id: 4, siteId: 4, name: 'About', description: 'About.', stateName: 'root.about', url: '#/about', content: '#About' }
        ];

        // Pages GET with id - these tend to be greedy so the more specific GET with parm HAS to be listed
        //  before the generic GET all or the GET all will suck up the GET with parm requests.
        $httpBackend.whenGET(/api\/pages\/[\d]+/).respond(function(method, url, data) {
            var path = $location.path(); // returns "/pages/edit-page/1", so the id will be index 3
            var pathArray = path.split('/');
            var id = pathArray[3];
            return [200, $filter('json')(getById(pages, id), indentSpacing), { 'Cache-control': 'no-cache' }];
        });
        // Pages GET all
        $httpBackend.whenGET(/api\/pages/).respond(function(method, url, data) {
            return [200, $filter('json')(pages, indentSpacing), { 'Cache-control': 'no-cache' }];
        });
        // Pages POST
        $httpBackend.whenPOST(/api\/pages/).respond(function(method, url, data) {
            // Add to our pages array, which is acting like a fake database
            var newPage = angular.fromJson(data);
            newPage.id = pages.push(newPage); // data should be the json site that was posted to us,
            //  and the new length of pages should make a fine fake Id
            return [200, newPage, {}]; // respond expects us to return array containing status, data, headers
        });
        // Pages PUT
        $httpBackend.whenPUT(/api\/pages\/[\d]+/).respond(function(method, url, data) {
            // Add to our pages array, which is acting like a fake database
            var updatedPage = angular.fromJson(data);
            var index = pages.indexOf(getById(pages, updatedPage.id));
            pages[index] = updatedPage;
            return [201, updatedPage, {}]; // respond expects us to return array containing status, data, headers
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

