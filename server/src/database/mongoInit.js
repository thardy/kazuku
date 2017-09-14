// just a running list of all the configurations made to the db. NOT CURRENTLY SETUP TO RUN THIS FILE
// todo: actually configure mongo using this file (this stuff is completely untested)

//// ***** Pages ****************************************
// NOTE:  I don't think we're going to use a Pages collection - pages will be represented by Templates with a url property

//// ***** CustomData ****************************************
//db.createCollection('customData', {});
//db.customData.createIndex( { "orgId": 1, "contentType": 1 });
//db.customData.createIndex( { "orgId": 1, "contentType": 1, "_id": 1 }, { unique: true } ); // created because we will always provide an orgId on lookups, to enforce multi-tenant
//
//// sample document
//var newCustomData = { orgId: 1, contentType: 'blogPost', title: 'My First Blog Post', content: 'Imagine a well written blog here.'};
//


//// ***** CustomSchemas ****************************************
//db.createCollection('customSchemas', {});
//db.customSchemas.createIndex( { "orgId": 1, "contentType": 1 }, { unique: true });
//
//// sample document - https://github.com/dschnelldavis/angular2-json-schema-form
//var newCustomSchema = {
//id: 1,
//    orgId: 1,
//    contentType: 'Applicant',
//    jsonSchema: {
//    "type": "object",
//        "properties": {
//        "affiliatedWith": {
//            "type": "string",
//                "name": "affiliatedWith",
//                "title": "Affiliated With"
//        },
//        "favoriteNumber": {
//            "type": "number",
//                "name": "favoriteNumber",
//                "title": "Favorite Number"
//        },
//        "likes": {
//            "type": "string",
//                "name": "likes",
//                "title": "Likes"
//        }
//    }
//};
//


//// ***** Templates ****************************************
//db.createCollection('templates', {});
// Case-insensitive index
//db.templates.createIndex( { "orgId": 1, "name": 1 }, { unique: true }, { collation: { locale: 'en', strength: 1 }});

//// sample document
//var newTemplate = { orgId: 1, siteId: 1, name: '$Test Template1', layout: 'master', template: '#Test Page 1 - Existing',
//                      dependencies: [], regenerate: 0,
//                      created: new Date(), createdBy: 1, updated: null, updatedBy: null};
//
//


//// ***** Queries ****************************************
//db.createCollection('queries', {});
// Case-insensitive index (requires MongoDb 3.4)
//db.queries.createIndex( { "orgId": 1, "name": 1 }, { unique: true }, { collation: { locale: 'en', strength: 1 }});

//// sample document
//var newQuery = { orgId: 1, siteId: 1, name: '$Test Template1', query: 'blah blah', results: [],
//                      description: 'this is a cool query',
//                      dependencies: [], regenerate: 0,
//                      created: new Date(), createdBy: 1, updated: null, updatedBy: null};
//
//



//// ***** Organizations ****************************************
//db.createCollection('organizations', {});
// Case-insensitive index
//db.organizations.createIndex( { "name": 1 }, { unique: true }, { collation: { locale: 'en', strength: 1 }} );
//db.organizations.createIndex( { "code": 1 }, { unique: true }, { collation: { locale: 'en', strength: 1 }} );

//// sample document
//var newOrg = { name: 'Acme Corp', code: 'acme', description: 'A cool company.', statusId: 1, isMetaOrg: false,
//                      created: new Date(), createdBy: 1, updated: null, updatedBy: null};
//
//



//// ***** Sites ****************************************
//db.createCollection('sites', {});
// Case-insensitive index
//db.sites.createIndex( { "orgId": 1, "code": 1 }, { unique: true }, { collation: { locale: 'en', strength: 1 }} );

//// sample document
//var newSite = { orgId: 1, code: 1, name: 'Acme Corp', domainName: 'mydomain.com',
//                      created: new Date(), createdBy: 1, updated: null, updatedBy: null};
//
//




//// ***** Users ****************************************
// db.createCollection('users', {});
//db.users.createIndex({ "email": 1 }, { unique: true }, { collation: { locale: 'en', strength: 1 }});

////sample document
// var newUser = { orgId: 1, email: "joe@test.com", password: "lkj234oiulkj", firstName: "Joe", lastName: "Smith", lastLoggedIn: "1/1/2017",
//                 facebook: {
//                     id: String,
//                     token: String,
//                     email: String,
//                     name: String
//                 },
//                 google: {
//                     id: String,
//                     token: String,
//                     email: String,
//                     name: String
//                 },
//                 created: new Date(), createdBy: 1, updated: null, updatedBy: null};
