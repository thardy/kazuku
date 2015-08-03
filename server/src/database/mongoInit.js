// just a running list of all the configurations made to the db. NOT CURRENTLY SETUP TO RUN THIS FILE
// todo: actually configure mongo using this file (this stuff is completely untested)

//// ***** Pages ****************************************
//db.createCollection('pages', {});
//db.pages.createIndex( { "siteId": 1, "url": 1 }, { unique: true } );
//
//// sample document
//var newPage = {orgId: 1, name: '$Test Page1', siteId: 1, url: '#/test', content: '#Test Page 1 - Existing',
//                created: new Date(), createdBy: 1, updated: null, updatedBy: null};
//

//// ***** CustomData ****************************************
//db.createCollection('customData', {});
//db.customData.createIndex( { "orgId": 1, "contentType": 1 });
//
//// sample document
//var newCustomData = { orgId: 1, contentType: 'blogPost', title: 'My First Blog Post', content: 'Imagine a well written blog here.'};
//


//// ***** CustomDataSchema ****************************************
//db.createCollection('customDataSchema', {});
//db.customDataSchema.createIndex( { "orgId": 1, "contentType": 1 }, { unique: true });
//
//// sample document
//var newCustomDataSchema = { };
//








//// ***** Templates ****************************************
//db.createCollection('templates', {});
//// sample document
//var newTemplate = {name: '$Test Template1', siteId: 1, content: '#Test Page 1 - Existing',
//                    created: new Date(), createdBy: 1, updated: null, updatedBy: null};
//
//
//// ***** BlogPosts ****************************************
//db.createCollection('blogposts', {});
//// sample document
//var newBlogPost = {title: '$Test Blog Post1', siteId: 1, content: '#Test Blog1',
//                    created: new Date(), createdBy: 1, updated: null, updatedBy: null};